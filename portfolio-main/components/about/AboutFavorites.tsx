import { Tag } from "@/components/Tag";
import { ArrowUpRightIcon } from "@/components/icons";
import { aboutFavorites } from "@/content/about";
import { FavoriteTravelCard } from "./FavoriteTravelCard";
import styles from "./AboutFavorites.module.css";

function ArrowLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      aria-label={label}
      className={styles.arrowLink}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <ArrowUpRightIcon aria-hidden="true" className={styles.arrowIcon} />
    </a>
  );
}

export function AboutFavorites() {
  const appItems = aboutFavorites.apps.items;

  return (
    <div className={styles.favorites}>
      <div className={styles.topRow}>
        <article className={`${styles.card} ${styles.largeCard} ${styles.readingCard}`}>
          <Tag>{aboutFavorites.reading.label}</Tag>
          <a
            aria-label="Open reading favorite"
            className={styles.readingImageFrame}
            href={aboutFavorites.reading.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            <img alt={aboutFavorites.reading.imageAlt} src={aboutFavorites.reading.imageSrc} />
          </a>
          <div className={styles.cardAction}>
            <ArrowLink href={aboutFavorites.reading.href} label="Open reading favorite" />
          </div>
        </article>

        <article className={`${styles.card} ${styles.largeCard} ${styles.movieCard}`}>
          <Tag>{aboutFavorites.movies.label}</Tag>
          <ol className={styles.movieList}>
            {aboutFavorites.movies.entries.map((movie, index) => (
              <li className={styles.movieItem} key={movie.title}>
                <a
                  className={styles.movieLink}
                  href={movie.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className={styles.movieIndex}>{index + 1}</span>
                  <span className={styles.movieCopy}>
                    <span className={styles.movieTitle}>{movie.title}</span>
                    <span className={styles.movieMeta}>{movie.meta}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
          <div className={styles.cardAction}>
            <ArrowLink href={aboutFavorites.movies.href} label="Open movie ratings" />
          </div>
        </article>
      </div>

      <div className={styles.bottomRow}>
        <FavoriteTravelCard {...aboutFavorites.travel} />

        <article className={`${styles.card} ${styles.smallCard} ${styles.musicCard}`}>
          <Tag>{aboutFavorites.music.label}</Tag>
          <div className={styles.musicBody}>
            <div className={styles.musicCopy}>
              <h3>{aboutFavorites.music.title}</h3>
              <p>{aboutFavorites.music.artist}</p>
            </div>
            <ArrowLink href={aboutFavorites.music.href} label="Open music favorite on Spotify" />
          </div>
        </article>

        <article className={`${styles.card} ${styles.smallCard} ${styles.appsCard}`}>
          <Tag>{aboutFavorites.apps.label}</Tag>
          <div className={styles.appCarousel} aria-label="Favorite apps carousel">
            <div className={styles.appTrack}>
              {[0, 1].map((groupIndex) => (
                <div
                  aria-hidden={groupIndex === 1 ? "true" : undefined}
                  className={styles.appGroup}
                  key={groupIndex}
                >
                  {appItems.map((app) => (
                    groupIndex === 0 ? (
                      <a
                        className={[
                          styles.appLogo,
                          app.src.endsWith("favorite-app-6.png") ? styles.spotifyAppLogo : ""
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        href={app.href}
                        key={`${groupIndex}-${app.src}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <img alt={app.alt} src={app.src} />
                      </a>
                    ) : (
                      <a
                        className={[
                          styles.appLogo,
                          app.src.endsWith("favorite-app-6.png") ? styles.spotifyAppLogo : ""
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        href={app.href}
                        key={`${groupIndex}-${app.src}`}
                        rel="noopener noreferrer"
                        tabIndex={-1}
                        target="_blank"
                      >
                        <img alt="" src={app.src} />
                      </a>
                    )
                  ))}
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
