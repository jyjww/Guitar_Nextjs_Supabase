import { supabase } from '../supabaseClient'; // supabase 클라이언트 import

export const handleCheckout = async (cartItems, totalAmount) => {
  const sessionKey = localStorage.getItem('sessionKey');

  if (!sessionKey) {
    console.error('체크아웃하려면 로그인이 필요합니다.');
    return { success: false, message: '체크아웃하려면 로그인이 필요합니다.' };
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    console.error('장바구니가 비어있습니다.');
    return { success: false, message: '장바구니가 비어있습니다.' };
  }

  // sessionKey를 사용하여 사용자 정보 가져오기
  const { data: userData, error: userError } = await supabase
    .from('member')
    .select('id, point, username')
    .eq('session_key', sessionKey)
    .single();

  if (userError || !userData) {
    console.error('유효하지 않은 세션입니다. 다시 로그인해주세요.');
    return { success: false, message: '유효하지 않은 세션입니다. 다시 로그인해주세요.' };
  }

  const currentPoints = parseFloat(userData.point) || 0;
  console.log('카트 아이템:', cartItems);
  console.log('총 금액:', totalAmount, typeof totalAmount);

  if (totalAmount === undefined || totalAmount === null) {
    console.error('총 금액이 제공되지 않았습니다.');
    return { success: false, message: '총 금액 계산에 실패했습니다. 다시 시도해 주세요.' };
  }

  let totalAmountNumber = parseFloat(totalAmount);

  if (isNaN(totalAmountNumber) || totalAmountNumber <= 0) {
    console.error('유효하지 않은 총 금액:', totalAmount);
    return { success: false, message: '유효하지 않은 총 금액입니다.' };
  }

  console.log('변환된 총 금액:', totalAmountNumber, typeof totalAmountNumber);

  if (currentPoints >= totalAmountNumber) {
    // 포인트 차감 (소수점 둘째 자리까지 계산)
    const newPoints = Math.round((currentPoints - totalAmountNumber) * 100) / 100;
    const { error: updateError } = await supabase
      .from('member')  // 'members'에서 'member'로 변경
      .update({ point: newPoints.toString() })
      .eq('id', userData.id);

    if (updateError) {
      console.error('포인트 업데이트 중 오류 발생:', updateError);
      return { success: false, message: '체크아웃 중 오류가 발생했습니다.' };
    }

    // 각 상품에 대해 shop_items 업데이트 및 purchase 테이블에 추가
    for (const item of cartItems) {
      console.log('처리 중인 아이템:', item);  // 디버깅을 위해 추가

      if (!item.id) {
        console.error('아이템 ID가 없습니다:', item);
        return { success: false, message: '일부 상품의 정보가 올바르지 않습니다. 관리자에게 문의해주세요.' };
      }

      // shop_items 테이블에서 상품 정보 가져오기
      const { data: shopItemData, error: shopItemError } = await supabase
        .from('shop_items')
        .select('sold, category')
        .eq('id', item.id)
        .single();

      if (shopItemError) {
        console.error('상품 정보 조회 중 오류 발생:', shopItemError);
        continue;
      }

      const newSoldCount = (shopItemData.sold || 0) + item.quantity;

      // shop_items 테이블 업데이트
      const { error: updateError } = await supabase
        .from('shop_items')
        .update({ sold: newSoldCount })
        .eq('id', item.id);

      if (updateError) {
        console.error('상품 판매 수량 업데이트 중 오류 발생:', updateError);
      }

      // purchase 테이블에 구매 기록 추가
      const { error: purchaseError } = await supabase
        .from('purchase')
        .insert({
          username: userData.username,
          category: shopItemData.category,
          name: item.name,
          price: item.price,
          img: item.img,
          quantity: item.quantity,
          date: new Date().toISOString()
        });

      if (purchaseError) {
        console.error('구매 기록 추가 중 오류 발생:', purchaseError);
      }
    }

    // 성공 시
    return { success: true, message: '체크아웃이 완료되었습니다.' };
  } else {
    const shortage = Math.ceil((totalAmountNumber - currentPoints) * 100) / 100;
    console.error(`포인트가 ${shortage}만큼 부족합니다.`);
    return { success: false, message: `포인트가 ${shortage}만큼 부족합니다.` };
  }
};