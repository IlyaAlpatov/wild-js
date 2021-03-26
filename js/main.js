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
const cartTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total');


const escapeHandler = event => {
	if (event.code === 'Escape') {
		modalCart.classList.remove('show');
	}
};

const openModal = () => {
	cart.renderCart();
	modalCart.classList.add('show');
	document.addEventListener('keydown', escapeHandler);
};

const closeModal = event => {
	const target = event.target;
	console.log(target);

	if (target.classList.contains('modal-close')) {
		modalCart.classList.remove('show');
		document.removeEventListener('keydown', escapeHandler);
	}
};

const cart = {
	cartGoods: [],
	renderCart() {
		cartTableGoods.textContent = '';
		this.cartGoods.forEach( ({ id, name, price, count }) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;

			trGood.innerHTML = `
				<td>${name}</td>
				<td>${price}$</td>
				<td><button class="cart-btn-minus">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus">+</button></td>
				<td>${price * count}$</td>
				<td><button class="cart-btn-delete">x</button></td>
			`;
			cartTableGoods.append(trGood);
		});

		const totalPrice = this.cartGoods.reduce( (sum, item) => {
			return sum + (item.price * item.count);
		}, 0);
		cardTableTotal.textContent = totalPrice + '$';
	},
	deliteGood(id) {
		this.cartGoods = this.cartGoods.filter( item => id !== item.id);
		this.renderCart();
	},
	minusGood(id) {
		for (const cartGood of this.cartGoods) {
			if (cartGood.id === id) {
				if (cartGood.count <= 1) {
					this.deliteGood(id);
				} else {
					cartGood.count--;
				}
				break;
			}
		}
		this.renderCart();
	},
	plusGood(id) {
		for (const cartGood of this.cartGoods) {
			if (cartGood.id === id) {
				cartGood.count++;
				break;
			}
		}
		this.renderCart();
	},
	addCartGoods(id) {
		const goodItem = this.cartGoods.find( item => item.id === id);
		if (goodItem) {
			this.plusGood(id);
		} else {
			getGoods()
				.then( data => data.find(  item => item.id === id))
				.then( ({ id, name, price}) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1,
					})
				});
			};
	},
}

document.body.addEventListener('click', event => {
	const addToCart = event.target.closest('.add-to-cart');
	if (addToCart) {
		cart.addCartGoods(addToCart.dataset.id);
	}
});

cartTableGoods.addEventListener('click', event => {
	const target = event.target;
	if (target.classList.contains('cart-btn-delete')) {
		const parent = target.closest('.cart-item');
		cart.deliteGood(parent.dataset.id);
	}

	if (target.classList.contains('cart-btn-minus')) {
		const parent = target.closest('.cart-item');
		cart.minusGood(parent.dataset.id);
	}

	if (target.classList.contains('cart-btn-plus')) {
		const parent = target.closest('.cart-item');
		cart.plusGood(parent.dataset.id);
	}
});

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

const viewScrolling = () => {
	setTimeout( () => {
		document.querySelector('body').scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	}, 300);
}

scrolling();

// goods

const more = document.querySelector('.more');
const navigationLinks = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
const accessoriesBtn = document.querySelector('.accessories-btn');
const clothingBtn = document.querySelector('.clothing-btn');


const getGoods = async () => {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw new Error("Статус: " + result.status);
	} else {
		return await result.json();
	}
	
}

const createCard = ({label, img, name, description, id, price}) => {
	const card =document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';
	card.innerHTML = `
		<div class="goods-card">
			${label ? 
			`<span class="label">${label}</span>`:
			''}
			<img src="db/${img}" alt="image: ${name}" class="goods-image">
			<h3 class="goods-title">${name}</h3>
			<p class="goods-description">${description}</p>
			<button class="button goods-card-btn add-to-cart" data-id="${id}">
				<span class="button-price">$${price}</span>
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
	viewScrolling();
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
	viewScrolling();
});

clothingBtn.addEventListener('click', event => {
	event.preventDefault();
	filterCards('category', 'Clothing');
	viewScrolling();
});
