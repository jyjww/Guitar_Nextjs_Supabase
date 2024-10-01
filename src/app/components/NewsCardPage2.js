//server component
import ClientComponent from '../components/NewsCardClient';

async function fetchNewsData() {
  // 데이터 생성: 서버에서 데이터를 가져오는 함수 (예시로 직접 데이터 사용)
  const newsItems = [
    {
      title: '2024 Promo',
      date: '2024-01-01',
      description: 'New release for base guitar',
      imageSrc: '/artist.jpg',
    },
  ];

  // 데이터 복제
  const newsItemFill = Array(10).fill(newsItems[0]);

  return newsItemFill;
}

export default async function NewsletterPage() {
  const newsItems = await fetchNewsData(); // 서버에서 데이터 가져오기

  return (
    <div className="overflow-x-hidden w-80% px-4 sm:px-8 lg:px-16">
      <ClientComponent newsItems={newsItems} />
    </div>
  );
}
