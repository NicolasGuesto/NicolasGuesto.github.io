import { gsap } from "gsap"
import buttonBefore from "../assets/images/levels-system/before.svg"
import buttonBeforeBlack from "../assets/images/levels-system/before-black.svg"
import buttonBeforeDisabled from "../assets/images/levels-system/before-disabled.svg"
import buttonNext from "../assets/images/levels-system/next-black.svg"
import buttonNextBlackDisabled from "../assets/images/levels-system/next-black-disabled.svg"

/** Хранение активной страницы. */
let activePage = 0
let step = 0
let mainSelector = ".rating-system__container"

/** Список всех использующихся селекторов. */
let selectors = {
	levelPage: mainSelector + " .rating-system__main-text",
	dash: mainSelector + " .rating-system__bar",
	button: mainSelector + " .rating-system__button",
	counter: mainSelector + " .rating-system__state",

	headerText: ".rating-system__header-text",
	blackButton: ".rating-system__black-button",
	divider: ".rating-system__divider",
	background: ".rating-system",
}

let levels = {}

/**  Преобразование селекторов в рабочие eлементы */
for (const key in selectors) {
	levels[key] = document.querySelectorAll(selectors[key])
}

// - Ограничения на прокрутку страниц
/**
 * Ограничение на прокрутки страниц.
 * @param {boolean} reverse Прокручивается ли страница назад. Если вперёд, то false.
 * @returns {boolean} Результат проверки. Если дальше можно листать, то true,
 * если дальше страниц нет, то false.
 */
function canTogglePage(reverse) {
	let result = true

	if (reverse && activePage === 0) {
		result = false
	} else if (!reverse && activePage === 5) {
		result = false
	}

	return result
}

/**
 * Переключение индикаторов текущей/активной страницы.
 * @param {boolean} reverse Прокручивается ли страница назад. Если вперёд, то false.
 */
function toggleDash(reverse) {
	if (!reverse) {
		gsap.to(levels.dash[activePage + 1], {
			duration: 0.3,
			backgroundColor: "#f63",
		})
	} else {
		gsap.to(levels.dash[activePage], {
			duration: 0.3,
			backgroundColor: "#dddddf",
		})
	}
}

/**
 * Плавное изменение иконок у кнопок.
 * @param {object} buttonImage Объект с кнопкой. Используется для изменения
 * иконки в разных состояниях.
 * @param {*} image Ссылка на новую иконку.
 * @param {*} duration Время анимации изменения иконки.
 */
async function changeButtonImage(buttonImage, image, duration) {
	let timeline = gsap
		.timeline({ paused: true })
		.to(buttonImage, { duration: duration, opacity: 0.5 })
		.set(buttonImage, { attr: { src: image } })
		.to(buttonImage, { duration: duration, opacity: 1 })
	timeline.play()
}

/**
 * Переключение состояния у кнопок - активна/отключена.
 * @param {boolean} reverse Прокручивается ли страница назад. Если вперёд, то false.
 * @returns
 */
function toggleButton(reverse) {
	let buttonImageBefore = levels.button[0].querySelector("img")
	let buttonImageNext = levels.button[1].querySelector("img")

	if (activePage === 1 && !reverse) {
		changeButtonImage(buttonImageBefore, buttonBefore)
		return
	} else if (activePage === 0 && reverse) {
		changeButtonImage(buttonImageBefore, buttonBeforeDisabled)
		return
	}

	if (activePage === 5 && !reverse) {
		changeButtonImage(buttonImageNext, buttonNext, 0.4)
		changeButtonImage(buttonImageBefore, buttonBeforeBlack, 0.4)
		return
	} else if ((activePage === 0 || activePage === 4) && reverse) {
		changeButtonImage(buttonImageNext, buttonNextBlackDisabled, 0.4)
		changeButtonImage(buttonImageBefore, buttonBefore, 0.4)
		return
	}
}

/** Анимация для переключения на чёный сектор. */
const levelsBlack = gsap
	.timeline({ paused: true })
	.to(levels.background, { duration: 0.125, background: "#080808" }, "<")
	.to(levels.headerText, { duration: 0.125, color: "#FFF" }, "<")
	.to(levels.divider, { duration: 0.125, background: "#373737" }, "<")
	.to(levels.counter, { duration: 0.125, color: "#FFF" }, "<")
	.to(levels.button[0], { duration: 0.2, background: "#262626" }, "<")
	.to(levels.button[1], { duration: 0.2, background: "#262626" }, "<")
	.to(levels.blackButton, { duration: 0.125, right: 0, autoAlpha: 1 }, 0.15)

/**
 * Функция переключения на чёрный сектор (последняя страница).
 * @param {boolean} reverse Прокручивается ли страница назад. Если вперёд, то false.
 */
function toggleBlack(reverse) {
	if (!reverse) {
		levelsBlack.play()
		console.log(levels.button)
	} else {
		levelsBlack.reverse()
	}
}

/**
 * Возврат к первой странице при нажатии на кнопку "Вернуться в начало".
 */
function returnToFirstPage() {
	let buttonImageBefore = levels.button[0].querySelector("img")
	let buttonImageNext = levels.button[1].querySelector("img")

	togglePage(true, true)

	for (let i = 1; i < 5; i++) {
		gsap.to(levels.dash[i], {
			duration: 0.3,
			backgroundColor: "#dddddf",
		})
	}

	changeButtonImage(buttonImageNext, buttonNextBlackDisabled, 0.4)
	changeButtonImage(buttonImageBefore, buttonBeforeDisabled, 0.4)
}

let animation = false

/** Отключение возможности нажимать кнопку во время анимации. */
function toggleAnimation() {
	animation = false
}

/**
 * Основная функция, управляющая перелистыванием страниц.
 * @param {boolean} reverse Прокручивается ли страница назад. Если вперёд, то false.
 */
function togglePage(reverse = false, toFirst = false) {
	let durationTime
	if (!canTogglePage(reverse)) {
		return
	}

	animation = true

	if ((!reverse && activePage === 4) || (reverse && activePage === 5)) {
		durationTime = 0.4
	} else {
		durationTime = 0.125
	}

	if (!toFirst) {
		step = reverse ? -1 : 1
	} else {
		step = -5
	}

	const changePage = gsap
		.timeline({ paused: true })
		.to(levels.levelPage[activePage], { duration: durationTime, autoAlpha: 0 })
		.to(levels.levelPage[activePage + step], {
			duration: durationTime,
			autoAlpha: 1,
		})

	changePage.play()

	if (!reverse && activePage === 4) {
		toggleBlack(false, changePage)
	} else if (reverse && activePage === 5) {
		toggleBlack(true, changePage)
	}
	changePage.eventCallback("onComplete", toggleAnimation)

	toggleDash(reverse)

	activePage += step

	toggleButton(reverse)
	levels.counter[0].innerText = activePage + 1 + "/6"
}

/** Слушатели событий по нажатию кнопки. */
document
	.querySelector(".rating-system__button-next")
	.addEventListener("click", () => {
		if (animation) {
			return
		}

		togglePage()
	})

document
	.querySelector(".rating-system__button-before")
	.addEventListener("click", () => {
		if (animation) {
			return
		}

		togglePage(true)
	})

/** Слушатель события для кнопки "Вернуться в начало". */
document
	.querySelector(".rating-system__black-button")
	.addEventListener("click", () => {
		returnToFirstPage()
	})
