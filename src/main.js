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
const limit = 15;
let currentInputValue = '';

const smoothScroll = () => {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

const toggleLoader = (show = false) => {
  refs.loader.classList.toggle('hidden', !show);
};

const toggleLoadMoreBtn = (show = false) => {
  refs.loadMore.classList.toggle('hidden', !show);
};

const onFormSubmit = async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const inputValue = refs.formInput.value.trim();

  if (inputValue === '') {
    iziToast.error({
      message: 'Please enter a search term.',
      position: 'topRight',
    });
    return;
  }

  currentPage = 1;
  currentInputValue = inputValue;
  refs.gallery.innerHTML = '';

  toggleLoadMoreBtn(false);
  toggleLoader(true);

  try {
    const data = await fetchImages(currentInputValue, currentPage, limit);
    const totalPages = Math.ceil(data.totalHits / limit);

    if (data.hits.length === 0) {
      iziToast.error({
        message: 'No images found. Please try a different search term.',
        position: 'topRight',
        closeOnClick: true,
      });
      return;
    }

    const markup = renderImages(data.hits);
    refs.gallery.innerHTML = markup;
    simpleLightbox.refresh();

    if (currentPage < totalPages) {
      toggleLoadMoreBtn(true);
    } else {
      iziToast.info({
        position: 'topRight',
        message: "We're sorry, but you've reached the end of search results.",
        closeOnClick: true,
      });
    }
  } catch (error) {
    iziToast.error({
      message: `Error: ${error.message}`,
      position: 'topRight',
      closeOnClick: true,
    });
  } finally {
    toggleLoader(false);
    form.reset();
  }
};

const onLoadMoreBtnClick = async () => {
  currentPage++;
  toggleLoader(true);
  toggleLoadMoreBtn(false);

  try {
    const data = await fetchImages(currentInputValue, currentPage, limit);
    const totalPages = Math.ceil(data.totalHits / limit);

    const markup = renderImages(data.hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);

    simpleLightbox.refresh();
    smoothScroll();

    if (currentPage < totalPages) {
      toggleLoadMoreBtn(true);
    } else {
      toggleLoadMoreBtn(false);
      iziToast.info({
        position: 'topRight',
        message: "We're sorry, but you've reached the end of search results.",
        closeOnClick: true,
      });
    }
  } catch (error) {
    iziToast.error({
      message: `Error: ${error.message}`,
      position: 'topRight',
      closeOnClick: true,
    });
  } finally {
    toggleLoader(false);
  }
};

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMore.addEventListener('click', onLoadMoreBtnClick);
