import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";
import { MotionReveal } from "@/components/MotionReveal";
import { writingArticles } from "@/content/portfolio";
import styles from "./page.module.css";

type PageParams = Promise<{
  slug: string;
}>;

type WritingArticle = (typeof writingArticles)[number];
type ArticleSection = WritingArticle["sections"][number];
type ArticleListData = Extract<ArticleSection, { list: unknown }>["list"];
type ArticleImageData =
  | Extract<ArticleSection, { image: unknown }>["image"]
  | Extract<ArticleSection, { images: unknown }>["images"][number];

const getArticleBySlug = (slug: string) =>
  writingArticles.find((article) => article.slug === slug);

const getNextArticleHref = (slug: string) => {
  const currentIndex = writingArticles.findIndex((article) => article.slug === slug);

  if (currentIndex === -1) {
    return "/writings";
  }

  const nextIndex = (currentIndex + 1) % writingArticles.length;
  return writingArticles[nextIndex]?.href ?? "/writings";
};

export function generateStaticParams() {
  return writingArticles.map((article) => ({
    slug: article.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return article.metadata;
}

function ArticleList({ list }: { list: ArticleListData }) {
  const ListTag = list.kind === "ordered" ? "ol" : "ul";

  return (
    <ListTag className={styles.list}>
      {list.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ListTag>
  );
}

function ArticleImage({ image }: { image: ArticleImageData }) {
  const variant = "variant" in image ? image.variant : "default";
  const figureClassName =
    variant === "bordered" ? `${styles.imageBlock} ${styles.imageBlockBordered}` : styles.imageBlock;
  const imageClassName =
    variant === "widePanorama"
      ? `${styles.articleImage} ${styles.articleImageWidePanorama}`
      : styles.articleImage;

  return (
    <figure className={figureClassName}>
      <img alt={image.alt} className={imageClassName} src={image.src} />
    </figure>
  );
}

function ArticleImages({ images }: { images: readonly ArticleImageData[] }) {
  return (
    <>
      {images.map((image) => (
        <ArticleImage image={image} key={image.src} />
      ))}
    </>
  );
}

function ArticleSection({ section, index }: { index: number; section: ArticleSection }) {
  const shouldLeadWithImage = section.id === "file-as-center";

  return (
    <MotionReveal
      as="section"
      className={styles.section}
      delay={Math.min(index, 3) * 60}
      id={section.id}
    >
      {shouldLeadWithImage && "image" in section ? <ArticleImage image={section.image} /> : null}

      <div className={styles.sectionText}>
        <h2 className={styles.sectionTitle}>{section.heading}</h2>
        <div className={styles.prose}>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {"list" in section ? <ArticleList list={section.list} /> : null}
          {"note" in section ? (
            <p className={styles.note}>
              {section.note.text}{" "}
              <a href={section.note.link.href} rel="noreferrer" target="_blank">
                {section.note.link.label}
              </a>
              .
            </p>
          ) : null}
        </div>
      </div>

      {!shouldLeadWithImage && "image" in section ? <ArticleImage image={section.image} /> : null}
      {"images" in section ? <ArticleImages images={section.images} /> : null}
    </MotionReveal>
  );
}

export default async function WritingArticlePage({ params }: { params: PageParams }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const nextArticleHref = getNextArticleHref(slug);

  if (!article) {
    notFound();
  }

  const isNarrowLayout = "layout" in article && article.layout === "narrow";
  const articleClassName = isNarrowLayout
    ? `${styles.article} ${styles.articleNarrow}`
    : styles.article;

  return (
    <>
      <FloatingNav />
      <main className={styles.main}>
        <MotionReveal as="article" className={articleClassName}>
          <figure className={styles.heroFigure}>
            <img alt={article.hero.alt} className={styles.heroImage} src={article.hero.src} />
            <figcaption className={styles.caption}>{article.hero.caption}</figcaption>
          </figure>

          <header className={styles.header}>
            <p className={styles.date}>{article.date}</p>
            <h1 className={styles.title}>{article.title}</h1>
            <p className={styles.intro}>{article.intro}</p>
          </header>

          <div className={styles.sections}>
            {article.sections.map((section, index) => (
              <ArticleSection index={index} key={section.id} section={section} />
            ))}
          </div>

          <nav aria-label="Article navigation" className={styles.actions}>
            <Button href={article.actions.back.href}>{article.actions.back.label}</Button>
            <Button href={nextArticleHref}>{article.actions.next.label}</Button>
          </nav>
        </MotionReveal>
      </main>
      <Footer width={isNarrowLayout ? "content" : "text"} />
    </>
  );
}
