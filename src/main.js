import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchImages from './js/pixabay-api';
import renderImages from './js/render-functions';

const refs = {
  form: document.querySelector('.form'),
  formInput: document.querySelector('.gallery-form-input'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader'),
  loadMore: document.querySelector('.load-more-btn'),
};

let simpleLightbox = new SimpleLightbox('.gallery-item-link', {
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let limit = 15;
let formInputValue = '';

const smoothScroll = () => {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

const onLoadMoreBtnClick = async e => {
  try {
    refs.loadMore.classList.add('hidden');
    refs.loader.classList.remove('hidden');

    currentPage++;
    const data = await fetchImages(formInputValue, currentPage, limit);
    const totalPages = Math.ceil(data.totalHits / limit);

    if (data.hits.length === 0) {
      refs.loadMore.classList.add('hidden');
      return;
    }
    const dataTemplate = renderImages(data.hits);
    refs.gallery.insertAdjacentHTML('beforeend', dataTemplate);

    refs.loadMore.classList.remove('hidden');
    refs.loader.classList.add('hidden');
    smoothScroll();
    simpleLightbox.refresh();
    if (currentPage >= totalPages) {
      refs.loader.classList.add('hidden');
      refs.loadMore.classList.add('hidden');
      iziToast.info({
        position: 'topRight',
        message: "We're sorry, but you've reached the end of search results.",
      });
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

refs.form.addEventListener('submit', async e => {
  e.preventDefault();

  const inputValue = refs.formInput.value.trim();
  formInputValue = inputValue;

  if (inputValue === '') {
    iziToast.error({
      message: 'Please enter a search term.',
      position: 'topRight',
      closeOnClick: true,
    });
    return;
  }

  refs.gallery.innerHTML = '';
  refs.gallery.classList.add('hidden');
  refs.loader.classList.remove('hidden');

  try {
    const data = await fetchImages(inputValue, currentPage);
    const totalPages = Math.ceil(data.totalHits / 50);
    refs.formInput.value = '';
    refs.loadMore.classList.add('hidden');

    if (data.hits.length === 0) {
      iziToast.error({
        message: 'No images found. Please try a different search term.',
        position: 'topRight',
        closeOnClick: true,
      });
      refs.loader.classList.add('hidden');
      refs.loadMore.classList.add('hidden');
      refs.gallery.classList.remove('hidden');
      return;
    }
    const loadGallery = renderImages(data.hits);
    refs.gallery.insertAdjacentHTML('beforeend', loadGallery);
    refs.loader.classList.add('hidden');
    refs.loadMore.classList.remove('hidden');

    if (currentPage >= totalPages) {
      refs.loader.classList.add('hidden');
      refs.loadMore.classList.add('hidden');
      iziToast.info({
        position: 'topRight',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }

    refs.loadMore.addEventListener('click', onLoadMoreBtnClick);
    simpleLightbox.refresh();
  } catch (error) {
    iziToast.error({
      message: `Error: ${error.message}`,
      position: 'topRight',
      closeOnClick: true,
    });
  } finally {
    refs.loader.classList.add('hidden');
    refs.gallery.classList.remove('hidden');
  }
});
