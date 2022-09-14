import { NextSeo } from "next-seo";
const title = "Leland Hacks Scrapbook";
const description =
  "Check out what everyone is working on and shipping at Leland Hacks!";
const url = "https://scrapbook.lelandhacks.com";
const Meta = () => {
  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        title,
        description,
        url,
        type: "website",
      }}
      twitter={{
        cardType: "summary",
      }}
    />
  );
};

export default Meta;
