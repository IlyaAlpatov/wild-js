const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// cart

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');

const escapeHandler = event => {
	if (event.code === 'Escape') {
		modalCart.classList.remove('show');
	}
};

const openModal = () => {
	modalCart.classList.add('show');
	document.addEventListener('keydown', escapeHandler);
};

const closeModal = event => {
	const target = event.target;

	if (target.classList.contains('modal-close') || !target.closest('.modal')) {
		modalCart.classList.remove('show');
		document.removeEventListener('keydown', escapeHandler);
	}
};

buttonCart.addEventListener('click', openModal);
modalCart.addEventListener('click', closeModal);

// scrolling

const scrollLinks = document.querySelectorAll('a.scroll-link');

for (let i = 0; i < scrollLinks.length; i++) {
	scrollLinks[i].addEventListener('click', event => {
		event.preventDefault();
		const id = scrollLinks[i].getAttribute('href');
		document.querySelector(id).scrollIntoView({
			behavior: "smooth",
			block: 'start',
		});
	});
}


