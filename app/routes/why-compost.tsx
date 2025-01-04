import {Layout} from "../components/Layout";
import {useLanguage} from "../contexts/LanguageContext";
import {LanguageToggle} from "../components/LanguageToggle";

export default function WhyCompost() {
  const {language} = useLanguage();

  const mainTitle = {
    ptText: {
      title: "Porquê compostar?",
    },
    enText: {
      title: "Why compost?",
    },
  };

  const landfillSection = {
    ptText: {
      title: "🗑️ Reduz Resíduos em Aterros",
      paragraph1:
        "A compostagem de resíduos orgânicos reduz a quantidade de resíduos que acabam em aterros e incineradores. Cerca de 30-40% dos resíduos em aterros são orgânicos.",
      paragraph2:
        "Os aterros estão sobrecarregados, e os resíduos orgânicos constituem uma grande parte deles. Nos aterros, os resíduos orgânicos decompõem-se muito mais lentamente e de forma anaeróbica, libertando metano nocivo, um poderoso gás com efeito de estufa. A compostagem ajuda a reduzir este impacto nocivo e fornece-nos material precioso para cultivar os nossos alimentos.",
      chartCaption: "Quantidade de resíduos orgânicos em aterros, 2018, USA",
      source:
        "Fonte: https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/guide-facts-and-figures-report-about",
    },
    enText: {
      title: "🗑️ Reduces Landfill Waste",
      paragraph1:
        "Composting organic waste reduces the amount of waste that ends up in landfills and incinerators. About 30-40% of landfill waste is organic.",
      paragraph2:
        "Landfills are overfilled, and organic waste make up a large part of them. In landfills organic waste decomposes much slower and anaerobically, releasing harmful methane, a potent greenhouse gas. Composting helps reduce this harmful impact and provides us with precious material to grow our food.",
      chartCaption: "Amount of organic waste in landfills, 2018, USA",
      source:
        "Source: https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/guide-facts-and-figures-report-about",
    },
  };

  const greenhouseSection = {
    ptText: {
      title: "🌡️ Previne Emissões de Gases de Efeito Estufa",
      paragraph:
        "Os resíduos orgânicos em aterros produzem metano (CH₄), um gás 84 vezes mais potente que o dióxido de carbono a curto prazo. A compostagem de materiais orgânicos de forma aeróbica (na presença de oxigênio) impede que o metano seja liberado na atmosfera, reduzindo o impacto ambiental geral.",
    },
    enText: {
      title: "🌡️ Prevents Greenhouse Gas Emissions",
      paragraph:
        "Organic waste in landfills produces methane (CH₄), a gas that is 84 times more powerful than carbon dioxide in the short term. Composting organic materials aerobically (in the presence of oxygen) prevents methane from being released into the atmosphere, reducing the overall environmental footprint.",
    },
  };

  const soilHealthSection = {
    ptText: {
      title: "🌾 Melhora a Saúde do Solo",
      paragraph:
        "O composto é uma rica fonte de nutrientes que pode ajudar a melhorar a fertilidade, estrutura e textura do solo. O composto enriquece o solo com minerais e micróbios essenciais, criando um solo vivo e biodiverso. O solo 'vivo' é muito mais absorvente de água, ajudando a reter a umidade, resultando em maior resiliência em tempos de seca ou inundações. Um solo vivo também reduz a erosão e promove o crescimento saudável das plantas, crucial para a agricultura, jardinagem e produção sustentável de alimentos.",
    },
    enText: {
      title: "🌾 Improves Soil Health",
      paragraph:
        "Compost is a rich source of nutrients that can help improve soil fertility, structure, and texture. Compost enriches the soil with essential minerals and microbes which creates a living, biodiverse soil. The 'alive' soil is much more absorbent of water, helping to retain moisture resulting in greater resilience in times of drought or floods. A living soil also reduces erosion and promotes healthy plant growth, which is crucial for agriculture, gardening, and sustainable food production.",
    },
  };

  const fertilizersSection = {
    ptText: {
      title: "🧪 Reduz a Necessidade de Fertilizantes Químicos",
      paragraph:
        "O composto é uma fonte natural de nutrientes. É o fertilizante da natureza e uma opção muito melhor que os fertilizantes químicos. Os fertilizantes sintéticos ou químicos são prejudiciais ao meio ambiente. Eles destroem a vida do solo, contaminam os suprimentos de água e degradam a saúde do solo ao longo do tempo. Além disso, as matérias-primas para fertilizantes sintéticos são frequentemente mineradas ou extraídas da terra, causando destruição de ecossistemas.",
    },
    enText: {
      title: "🧪 Reduces the Need for Chemical Fertilizers",
      paragraph:
        "Compost is a natural source of nutrients. It's natures fertilizer and a much better option than chemical fertilizers. Synthetic or chemical fertilizers are harmful to the environment. They destroy soil life, contaminate water supplies, and degrade soil health over time. Furthermore the raw materials for synthetic fertilizers are often mined or extracted from the earth, which causes destruction of ecosystems.",
    },
  };

  const sustainableSection = {
    ptText: {
      title: "🌱 Promove a Vida Sustentável",
      paragraph:
        "A compostagem é uma maneira simples e acessível de participar de um estilo de vida mais sustentável. Ao compostar, os indivíduos contribuem para uma economia circular onde o resíduo orgânico é transformado em um produto útil, reduzindo a dependência de recursos externos e ajudando a fechar o ciclo natural. Envolve as pessoas no caminho da natureza e oferece educação para jovens e idosos. A compostagem pode ser feita e beneficiada em comunidade.",
    },
    enText: {
      title: "🌱 Promotes Sustainable Living",
      paragraph:
        "Composting is a simple and accessible way to participate in a more sustainable lifestyle. By composting, individuals contribute to a circular economy where organic waste is turned into a useful product, reducing reliance on external resources and helping to close the loop in natural cycles. It engages people in natures way and offers education to the young and old. Composting can be done and benefitted from in community.",
    },
  };

  const conclusionSection = {
    ptText: {
      title: "Então, por que compostamos? Bem, por que não? 🤔",
      subtitle:
        "Simplesmente observando os resíduos orgânicos se transformarem em solo, estamos participando da magia da natureza.",
    },
    enText: {
      title: "So  why do we compost? Well, why wouldn't we? 🤔",
      subtitle:
        "Simply by watching organic waste turn into soil we are taking part in the magic of nature.",
    },
  };

  const finalMessage = {
    ptText: {
      title: "Terra feliz, humanos felizes! 🌍",
    },
    enText: {
      title: "Happy earth, happy humans! 🌍",
    },
  };

  return (
    <Layout>
      <LanguageToggle />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {language === "pt"
              ? mainTitle.ptText.title
              : mainTitle.enText.title}
          </h1>
        </div>

        {/* Landfill Waste Section */}
        <div className="mb-16">
          <div className="bg-amber-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {language === "pt"
                ? landfillSection.ptText.title
                : landfillSection.enText.title}
            </h2>
            <p className="text-lg">
              {language === "pt"
                ? landfillSection.ptText.paragraph1
                : landfillSection.enText.paragraph1}
            </p>
          </div>

          <div className="my-8">
            <img
              src="/msw_chart.png"
              alt="Municipal Solid Waste Chart"
              className="mx-auto w-3/4 "
            />
            <p className="text-sm text-center text-gray-600 italic mb-1">
              {language === "pt"
                ? landfillSection.ptText.chartCaption
                : landfillSection.enText.chartCaption}
            </p>
            <p className="text-xs text-center text-gray-500">
              {language === "pt"
                ? landfillSection.ptText.source
                : landfillSection.enText.source}
            </p>
          </div>

          <div className="bg-red-50 rounded-lg p-8 mb-8">
            <p className="text-lg">
              {language === "pt"
                ? landfillSection.ptText.paragraph2
                : landfillSection.enText.paragraph2}
            </p>
          </div>

          <img
            src="/compostable_pie_chart.png"
            alt="Compostable Waste Chart"
            className="mx-auto max-w-md"
          />
        </div>

        {/* Greenhouse Gas Section */}
        <div className="mb-16">
          <div className="bg-green-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">
              {language === "pt"
                ? greenhouseSection.ptText.title
                : greenhouseSection.enText.title}
            </h2>
            <p className="text-lg">
              {language === "pt"
                ? greenhouseSection.ptText.paragraph
                : greenhouseSection.enText.paragraph}
            </p>
          </div>
        </div>

        {/* Soil Health Section */}
        <div className="mb-16">
          <div className="bg-orange-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">
              {language === "pt"
                ? soilHealthSection.ptText.title
                : soilHealthSection.enText.title}
            </h2>
            <p className="text-lg">
              {language === "pt"
                ? soilHealthSection.ptText.paragraph
                : soilHealthSection.enText.paragraph}
            </p>
          </div>
        </div>

        {/* Fertilizers Section */}
        <div className="mb-16">
          <div className="bg-teal-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">
              {language === "pt"
                ? fertilizersSection.ptText.title
                : fertilizersSection.enText.title}
            </h2>
            <p className="text-lg">
              {language === "pt"
                ? fertilizersSection.ptText.paragraph
                : fertilizersSection.enText.paragraph}
            </p>
          </div>
        </div>

        {/* Sustainable Living Section */}
        <div className="mb-16">
          <div className="bg-violet-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">
              {language === "pt"
                ? sustainableSection.ptText.title
                : sustainableSection.enText.title}
            </h2>
            <p className="text-lg">
              {language === "pt"
                ? sustainableSection.ptText.paragraph
                : sustainableSection.enText.paragraph}
            </p>
          </div>
        </div>

        {/* Conclusion Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl mb-4">
            {language === "pt"
              ? conclusionSection.ptText.title
              : conclusionSection.enText.title}
          </h2>
          <h3 className="text-2xl text-gray-600 mb-8">
            {language === "pt"
              ? conclusionSection.ptText.subtitle
              : conclusionSection.enText.subtitle}
          </h3>
          <img
            src="/happy_earth.png"
            alt="Happy Earth"
            className="mx-auto max-w-sm"
          />
        </div>

        {/* Final Message */}
        <div className="text-center mb-8">
          <h2 className="text-4xl text-green-600 animate-bounce">
            {language === "pt"
              ? finalMessage.ptText.title
              : finalMessage.enText.title}
          </h2>
        </div>
      </div>
    </Layout>
  );
}
