import { gsap } from "gsap"

/** Хранение состояния обложек */
let coverState = {
	white: true,
	black: true,
}

/**
 * Поивление и исчезновение обложки у блоков.
 * @param {string} color - Цвет блока, с которым взаимодействует пользователь. Может быть black и white.
 * @param {boolean} focus - Положение мышки на блоке или нет. Если пользователь уводит мышку, то блок возвращается в состояние по-умолчанию.
 */
function toggleCover(color, focus = false) {
	let cover = "#levels-system__cover--" + color

	const timeline = gsap
		.timeline({ paused: true })
		.to(document.querySelector(cover), { duration: 0.15, autoAlpha: 0 })

	const timelineReverse = gsap
		.timeline({ paused: true })
		.to(document.querySelector(cover), { duration: 0.25, autoAlpha: 1 })

	if (coverState[color] === true && !focus) {
		timeline.play()
		coverState[color] = false
	} else if (focus) {
		timelineReverse.play()
		coverState[color] = true
	}
}

/** Слушатели событий для кнопок обложек и контроль положения мышки для анимаций при наведении. */
document
	.querySelector("#levels-system__button-about--white")
	.addEventListener("click", () => {
		toggleCover("white")
	})

document
	.querySelector("#levels-system__cover--white")
	.addEventListener("click", () => {
		window.innerWidth < 768 ? toggleCover("white") : null
	})
document
	.querySelector("#levels-system__button-about--black")
	.addEventListener("click", () => {
		toggleCover("black")
	})

document
	.querySelector("#levels-system__cover--black")
	.addEventListener("click", () => {
		window.innerWidth < 768 ? toggleCover("black") : null
	})

document
	.querySelector(".levels-system__sector-column--black")
	.addEventListener("mouseleave", () => {
		toggleCover("black", true)
	})

document
	.querySelector(".levels-system__sector-column--white")
	.addEventListener("mouseleave", () => {
		toggleCover("white", true)
	})

/** Отслеживание активных страниц в блоках. */
let sectorPage = {
	white: 0,
	black: 0,
}

/**
 * Ограничение на перелистывание страниц в блоках.
 * @param {string} color - Цвет блока, с которым взаимодействует пользователь. Может быть black и white.
 * @param {boolean} reverse - Направление движения при преходе с одной страницыц на другую.
 * @returns
 */
function canTogglePage(color, reverse) {
	let result = true
	if (color === "white") {
		if (reverse && sectorPage.white === 0) {
			result = false
		} else if (!reverse && sectorPage.white === 5) {
			result = false
		}
	} else if (color === "black") {
		if (reverse && sectorPage.black === 0) {
			result = false
		} else if (!reverse && sectorPage.black === 1) {
			result = false
		}
	}

	return result
}

/**
 * Переключение индикаторов текущей страницы.
 * @param {Array} dash - Массив с индикаторами страниц.
 * @param {boolean} reverse - Направление движения.
 * @param {string} color - Цвет блока, с которым взаимодействует пользователь. Может быть black и white.
 */
function toggleDash(dash, reverse, color) {
	let dashBackgroundColor = color === "black" ? "#373737" : "#dddddf"

	if (!reverse) {
		gsap.to(dash[sectorPage[color] + 1], {
			duration: 0.25,
			backgroundColor: "#f63",
		})
	} else {
		gsap.to(dash[sectorPage[color]], {
			duration: 0.25,
			backgroundColor: dashBackgroundColor,
		})
	}
}

/**
 * Отключение и включение кнопок при достижении ограничения.
 * @param {Array} buttons - Массив с кнопками переключения страниц.
 * @param {string} color - Цвет блока, с которым взаимодействует пользователь. Может быть black и white.
 */
function toggleButton(buttons, color) {
	let beforeButton = "levels-system__button-before--disabled"
	let nextButton = "levels-system__button-next--disabled"

	buttons[0].classList.remove(beforeButton)
	buttons[1].classList.remove(nextButton)

	if (color === "white") {
		if (sectorPage.white === 0) {
			buttons[0].classList.add(beforeButton)
		} else if (sectorPage.white === 5) {
			buttons[1].classList.add(nextButton)
		}
	} else if (color === "black") {
		if (sectorPage.black === 0) {
			buttons[0].classList.add(beforeButton)
		} else if (sectorPage.black === 1) {
			buttons[1].classList.add(nextButton)
		}
	}
}

let animation = false
/**
 * Основная функция, контролирующая переворот страничек у блоков.
 * @param {string} color - Цвет блока, с которым взаимодействует пользователь. Может быть black и white.
 * @param {boolean} reverse - Направление движения.
 */
async function togglePage(color, reverse = false) {
	if (!canTogglePage(color, reverse)) {
		return
	}

	animation = true

	let step = reverse ? -1 : 1
	let mainSelector = ".levels-system__sector-column--" + color

	let descriptionHeader = document.querySelectorAll(
		mainSelector + " .levels-system__description-header"
	)
	let dash = document.querySelectorAll(mainSelector + " .levels-system__dash")
	let button = document.querySelectorAll(
		mainSelector + " .levels-system__button"
	)

	const timeline = gsap
		.timeline({ paused: true })
		.to(descriptionHeader[sectorPage[color]], { duration: 0.125, autoAlpha: 0 })
		.to(descriptionHeader[sectorPage[color] + step], {
			duration: 0.125,
			autoAlpha: 1,
		})

	timeline.play()
	timeline.eventCallback("onComplete", toggleAnimation)

	toggleDash(dash, reverse, color)

	color === "white" ? (sectorPage.white += step) : (sectorPage.black += step)

	toggleButton(button, color)

	function toggleAnimation() {
		animation = false
	}
}

/** Обработчики событий для кнопок переворота страниц. */
document
	.querySelector("#levels-system__button-before--white")
	.addEventListener("click", () => {
		if (animation) {
			return
		}

		togglePage("white", true)
	})

document
	.querySelector("#levels-system__button-next--white")
	.addEventListener("click", () => {
		if (animation) {
			return
		}

		togglePage("white")
	})

document
	.querySelector("#levels-system__button-before--black")
	.addEventListener("click", () => {
		if (animation) {
			return
		}

		togglePage("black", true)
	})
document
	.querySelector("#levels-system__button-next--black")
	.addEventListener("click", () => {
		if (animation) {
			return
		}

		togglePage("black")
	})
