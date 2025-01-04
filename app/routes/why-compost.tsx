import {Layout} from "../components/Layout";
import {useLanguage} from "../contexts/LanguageContext";
import {LanguageToggle} from "../components/LanguageToggle";

export default function WhyCompost() {
  const {language} = useLanguage();

  const mainTitle = {
    ptText: {
      title: <h1 className="text-4xl font-bold">Porquê compostar?</h1>,
    },
    enText: {
      title: <h1 className="text-4xl font-bold">Why compost?</h1>,
    },
  };

  const landfillSection = {
    ptText: {
      title: (
        <h2 className="text-2xl font-semibold mb-4">
          🗑️ Reduz Resíduos em Aterros
        </h2>
      ),
      paragraph1: (
        <p className="text-lg">
          A compostagem de resíduos orgânicos reduz a quantidade de resíduos que
          acabam em aterros e incineradores.
          <br />
          <br />
          Cerca de <strong>30-40%</strong> dos resíduos em aterros são
          orgânicos.
        </p>
      ),
      paragraph2: (
        <p className="text-lg">
          Os aterros estão sobrecarregados, e os resíduos orgânicos constituem
          uma grande parte deles. Nos aterros, os resíduos orgânicos
          decompõem-se muito mais lentamente e de forma anaeróbica, libertando
          metano nocivo, um poderoso gás com efeito de estufa.
          <br />
          <br />A compostagem ajuda a reduzir este impacto nocivo e fornece-nos
          <strong> material precioso para cultivar os nossos alimentos</strong>.
        </p>
      ),
      chartCaption: "Quantidade de resíduos orgânicos em aterros, 2018, USA",
      source:
        "Fonte: https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/guide-facts-and-figures-report-about",
    },
    enText: {
      title: (
        <h2 className="text-2xl font-semibold mb-4">
          🗑️ Reduces Landfill Waste
        </h2>
      ),
      paragraph1: (
        <p className="text-lg">
          Composting organic waste reduces the amount of waste that ends up in
          landfills and incinerators.
          <br />
          <br />
          About <strong>30-40%</strong> of landfill waste is organic.
        </p>
      ),
      paragraph2: (
        <p className="text-lg">
          Landfills are overfilled, and organic waste make up a large part of
          them. In landfills organic waste decomposes much slower and
          anaerobically, releasing harmful methane, a potent greenhouse gas.
          <br />
          <br />
          Composting helps reduce this harmful impact and provides us with
          <strong> precious material to grow our food</strong>.
        </p>
      ),
      chartCaption: "Amount of organic waste in landfills, 2018, USA",
      source:
        "Source: https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/guide-facts-and-figures-report-about",
    },
  };

  const greenhouseSection = {
    ptText: {
      title: (
        <h2 className="text-2xl font-semibold mb-4">
          🌡️ Previne Emissões de Gases de Efeito Estufa
        </h2>
      ),
      paragraph: (
        <p className="text-lg">
          Os resíduos orgânicos em aterros produzem{" "}
          <strong>metano (CH₄)</strong>, um gás{" "}
          <strong>84 vezes mais potente</strong> que o dióxido de carbono a
          curto prazo. <br />
          <br />A compostagem de materiais orgânicos de forma aeróbica (na
          presença de oxigênio){" "}
          <strong>impede que o metano seja liberado na atmosfera</strong>,
          reduzindo o impacto ambiental geral.
        </p>
      ),
    },
    enText: {
      title: (
        <h2 className="text-2xl font-semibold mb-4">
          🌡️ Prevents Greenhouse Gas Emissions
        </h2>
      ),
      paragraph: (
        <p className="text-lg">
          Organic waste in landfills produces <strong>methane (CH₄)</strong>, a
          gas that is <strong>84 times more powerful</strong> than carbon
          dioxide in the short term. <br />
          <br />
          Composting organic materials aerobically (in the presence of oxygen)
          <strong> prevents methane from being released</strong> into the
          atmosphere, reducing the overall environmental footprint.
        </p>
      ),
    },
  };

  const soilHealthSection = {
    ptText: {
      title: (
        <h2 className="text-2xl font-semibold mb-4">
          🌾 Melhora a Saúde do Solo
        </h2>
      ),
      paragraph: (
        <p className="text-lg">
          O composto é uma <strong>rica fonte de nutrientes</strong> que pode
          ajudar a melhorar a fertilidade, estrutura e textura do solo. <br />
          <br />O composto enriquece o solo com minerais e micróbios essenciais,
          criando um <strong>solo vivo e biodiverso</strong>. <br />
          <br />O solo &apos;vivo&apos; é muito mais absorvente de água,
          ajudando a reter a umidade, resultando em{" "}
          <strong>maior resiliência em tempos de seca ou inundações</strong>. Um
          solo vivo também reduz a erosão e promove o crescimento saudável das
          plantas, crucial para a agricultura, jardinagem e produção sustentável
          de alimentos.
        </p>
      ),
    },
    enText: {
      title: (
        <h2 className="text-2xl font-semibold mb-4">🌾 Improves Soil Health</h2>
      ),
      paragraph: (
        <p className="text-lg">
          Compost is a <strong>rich source of nutrients</strong> that can help
          improve soil fertility, structure, and texture. <br />
          <br />
          Compost enriches the soil with essential minerals and microbes which
          creates a <strong>living, biodiverse soil</strong>. <br />
          <br />
          The &apos;alive&apos; soil is much more absorbent of water, helping to
          retain moisture resulting in{" "}
          <strong>greater resilience in times of drought or floods</strong>. A
          living soil also reduces erosion and promotes healthy plant growth,
          which is crucial for agriculture, gardening, and sustainable food
          production.
        </p>
      ),
    },
  };

  const fertilizersSection = {
    ptText: {
      title: (
        <h2 className="text-2xl font-semibold mb-4">
          🧪 Reduz a Necessidade de Fertilizantes Químicos
        </h2>
      ),
      paragraph: (
        <p className="text-lg">
          O composto é uma <strong>fonte natural de nutrientes</strong>. É o
          fertilizante da natureza e uma opção muito melhor que os fertilizantes
          químicos. <br />
          <br />
          Os fertilizantes sintéticos ou químicos são{" "}
          <strong>prejudiciais ao meio ambiente</strong>. Eles destroem a vida
          do solo, contaminam os suprimentos de água e degradam a saúde do solo
          ao longo do tempo. <br />
          <br />
          Além disso, as matérias-primas para fertilizantes sintéticos são
          frequentemente
          <strong> mineradas ou extraídas da terra</strong>, causando destruição
          de ecossistemas.
        </p>
      ),
    },
    enText: {
      title: (
        <h2 className="text-2xl font-semibold mb-4">
          🧪 Reduces the Need for Chemical Fertilizers
        </h2>
      ),
      paragraph: (
        <p className="text-lg">
          Compost is a <strong>natural source of nutrients</strong>. It&apos;s
          nature&apos;s fertilizer and a much better option than chemical
          fertilizers. <br />
          <br />
          Synthetic or chemical fertilizers are{" "}
          <strong>harmful to the environment</strong>. They destroy soil life,
          contaminate water supplies, and degrade soil health over time. <br />
          <br />
          Furthermore the raw materials for synthetic fertilizers are often{" "}
          <strong>mined or extracted from the earth</strong>, which causes
          destruction of ecosystems.
        </p>
      ),
    },
  };

  const sustainableSection = {
    ptText: {
      title: (
        <h2 className="text-2xl font-semibold mb-4">
          🌱 Promove a Vida Sustentável
        </h2>
      ),
      paragraph: (
        <p className="text-lg">
          A compostagem é uma maneira <strong>simples e acessível</strong> de
          participar de um estilo de vida mais sustentável. <br />
          <br />
          Ao compostar, os indivíduos contribuem para uma{" "}
          <strong>economia circular </strong>
          onde o resíduo orgânico é transformado em um produto útil, reduzindo a
          dependência de recursos externos e ajudando a fechar o ciclo natural.{" "}
          <br />
          <br />
          Envolve as pessoas no caminho da natureza e oferece{" "}
          <strong>educação para jovens e idosos</strong>. A compostagem pode ser
          feita e beneficiada em comunidade.
        </p>
      ),
    },
    enText: {
      title: (
        <h2 className="text-2xl font-semibold mb-4">
          🌱 Promotes Sustainable Living
        </h2>
      ),
      paragraph: (
        <p className="text-lg">
          Composting is a <strong>simple and accessible way</strong> to
          participate in a more sustainable lifestyle. <br />
          <br />
          By composting, individuals contribute to a{" "}
          <strong>circular economy</strong> where organic waste is turned into a
          useful product, reducing reliance on external resources and helping to
          close the loop in natural cycles. <br />
          <br />
          It engages people in nature&apos;s way and offers{" "}
          <strong>education to the young and old</strong>. Composting can be
          done and benefitted from in community.
        </p>
      ),
    },
  };

  const conclusionSection = {
    ptText: {
      title: (
        <h2 className="text-3xl mb-4">
          Então, por que compostamos? Bem, por que não? 🤔
        </h2>
      ),
      subtitle: (
        <h3 className="text-2xl text-gray-600 mb-8">
          Simplesmente observando os resíduos orgânicos se transformarem em
          solo, estamos participando da magia da natureza.
        </h3>
      ),
    },
    enText: {
      title: (
        <h2 className="text-3xl mb-4">
          So why do we compost? Well, why wouldn&apos;t we? 🤔
        </h2>
      ),
      subtitle: (
        <h3 className="text-2xl text-gray-600 mb-8">
          Simply by watching organic waste turn into soil we are taking part in
          the magic of nature.
        </h3>
      ),
    },
  };

  const finalMessage = {
    ptText: {
      title: (
        <h2 className="text-4xl text-green-600 animate-bounce">
          Terra feliz, humanos felizes! 🌍
        </h2>
      ),
    },
    enText: {
      title: (
        <h2 className="text-4xl text-green-600 animate-bounce">
          Happy earth, happy humans! 🌍
        </h2>
      ),
    },
  };

  return (
    <Layout>
      <LanguageToggle />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Title */}
        <div className="text-center mb-12">
          {language === "pt" ? mainTitle.ptText.title : mainTitle.enText.title}
        </div>

        {/* Landfill Waste Section */}
        <div className="mb-16">
          <div className="bg-amber-50 rounded-lg p-8 mb-8">
            {language === "pt"
              ? landfillSection.ptText.title
              : landfillSection.enText.title}
            {language === "pt"
              ? landfillSection.ptText.paragraph1
              : landfillSection.enText.paragraph1}
          </div>

          <div className="my-8">
            <img
              src="/msw_chart.png"
              alt="Municipal Solid Waste Chart"
              className="mx-auto w-3/4"
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
            {language === "pt"
              ? landfillSection.ptText.paragraph2
              : landfillSection.enText.paragraph2}
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
            {language === "pt"
              ? greenhouseSection.ptText.title
              : greenhouseSection.enText.title}
            {language === "pt"
              ? greenhouseSection.ptText.paragraph
              : greenhouseSection.enText.paragraph}
          </div>
        </div>

        {/* Soil Health Section */}
        <div className="mb-16">
          <div className="bg-orange-50 rounded-lg p-8">
            {language === "pt"
              ? soilHealthSection.ptText.title
              : soilHealthSection.enText.title}
            {language === "pt"
              ? soilHealthSection.ptText.paragraph
              : soilHealthSection.enText.paragraph}
          </div>
        </div>

        {/* Fertilizers Section */}
        <div className="mb-16">
          <div className="bg-teal-50 rounded-lg p-8">
            {language === "pt"
              ? fertilizersSection.ptText.title
              : fertilizersSection.enText.title}
            {language === "pt"
              ? fertilizersSection.ptText.paragraph
              : fertilizersSection.enText.paragraph}
          </div>
        </div>

        {/* Sustainable Living Section */}
        <div className="mb-16">
          <div className="bg-violet-50 rounded-lg p-8">
            {language === "pt"
              ? sustainableSection.ptText.title
              : sustainableSection.enText.title}
            {language === "pt"
              ? sustainableSection.ptText.paragraph
              : sustainableSection.enText.paragraph}
          </div>
        </div>

        {/* Conclusion Section */}
        <div className="text-center mb-16">
          {language === "pt"
            ? conclusionSection.ptText.title
            : conclusionSection.enText.title}
          {language === "pt"
            ? conclusionSection.ptText.subtitle
            : conclusionSection.enText.subtitle}
          <img
            src="/happy_earth.png"
            alt="Happy Earth"
            className="mx-auto max-w-sm"
          />
        </div>

        {/* Final Message */}
        <div className="text-center mb-8">
          {language === "pt"
            ? finalMessage.ptText.title
            : finalMessage.enText.title}
        </div>
      </div>
    </Layout>
  );
}
