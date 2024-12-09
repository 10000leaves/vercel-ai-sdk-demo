const features = [
  {
    title: '簡単',
    description: 'シンプルで使いやすい',
    icon: '🎯',
  },
  {
    title: '高速',
    description: '快適な操作性',
    icon: '⚡',
  },
  {
    title: '安全',
    description: '安心してご利用いただけます',
    icon: '🔒',
  },
];

export default function Home() {
  return (
    <div>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* 説明セクション */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to My App
          </h1>
          <p className="text-gray-600 mb-8">
            シンプルな生成AIアプリ
          </p>
          <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            何も起きないボタン
          </button>
        </section>

        {/* 特徴セクション */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">特徴</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border shadow-sm"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

    </div>
  );
}