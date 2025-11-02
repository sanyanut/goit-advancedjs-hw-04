export default function renderImages(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
            <li class='gallery-list-item'>
                <a href='${largeImageURL}' class='gallery-item-link'>
                    <img src='${webformatURL}' class='gallery-item-image' alt='${tags}'/>
                    <div class='gallery-item-info'>
                        <p class='gallery-info-item'>Likes <span>${likes}</span></p>
                        <p class='gallery-info-item'>Views <span>${views}</span></p>
                        <p class='gallery-info-item'>Comments <span>${comments}</span></p>
                        <p class='gallery-info-item'>Downloads <span>${downloads}</span></p>
                    </div>
                </a>
            </li>
        `;
      }
    )
    .join('');
  return markup;
}
