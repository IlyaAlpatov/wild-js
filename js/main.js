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

const scrolling = () => {
	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', event => {
			console.log('dfd');
			event.preventDefault();
			const id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: "smooth",
				block: 'start',
			});
		});
	}
}

scrolling();

// goods

const more = document.querySelector('.more');
const navigationLinks = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
const accessoriesBtn = document.querySelector('.accessories-btn');
const clothingBtn = document.querySelector('.clothing-btn');


const getGoods = async function () {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw new Error("Статус: " + result.status);
	} else {
		return await result.json();
	}
	
}

const createCard = objCard => {
	const card =document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';
	card.innerHTML = `
		<div class="goods-card">
			${objCard.label ? 
			`<span class="label">${objCard.label}</span>`:
			''}
			<img src="db/${objCard.img}" alt="image: ${objCard.name}" class="goods-image">
			<h3 class="goods-title">${objCard.name}</h3>
			<p class="goods-description">${objCard.description}</p>
			<button class="button goods-card-btn add-to-cart" data-id="${objCard.id}">
				<span class="button-price">$${objCard.price}</span>
			</button>
		</div>
	`	
	return card;

}

const renderCards = data => {
	
	longGoodsList.textContent = '';
	const cards = data.map(createCard);
	cards.forEach( card => {
		longGoodsList.append(card);
	});
	document.body.classList.add('show-goods');
}

more.addEventListener('click', event => {
	event.preventDefault();
	getGoods()
		.then(renderCards);

		setTimeout( () => {
			document.querySelector('body').scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}, 300);
});

const filterCards = (field, value) => {
	getGoods()
		.then( data => {
			const filteredGoods = data.filter( good => {
				return good[field] === value;
			});
			return filteredGoods;
		})
		.then(renderCards);
};

navigationLinks.forEach( link => {
	link.addEventListener('click', event => {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		if (value === 'All') {
			getGoods().then(renderCards);
		} else {
			filterCards(field, value);
		}
	});
});

accessoriesBtn.addEventListener('click', event => {
	event.preventDefault();
	filterCards('category', 'Accessories');
	setTimeout( () => {
		document.querySelector('body').scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	}, 300);
});

clothingBtn.addEventListener('click', event => {
	event.preventDefault();
	filterCards('category', 'Clothing');
	
	setTimeout( () => {
		document.querySelector('body').scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	}, 300);
});
