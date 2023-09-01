import { gsap } from "gsap"
import { TextPlugin } from "gsap/TextPlugin"

gsap.registerPlugin(TextPlugin)

const scopeCards = document.querySelectorAll(".scope__description")

/**
 * Отследивание состояния карточек.
 */
let scopeStates = [false, false, false, false, false]

/**
 * Анимации для карточек сфер. Прохождение по всем карточкам, инициализация анимаций и слушателей событий.
 */
scopeCards.forEach(function (item, index) {
	const timeline = gsap
		.timeline({ paused: true })
		.to(item.querySelector(".scope__image"), { duration: 0.25, autoAlpha: 0 })

	const button = gsap
		.timeline({ paused: true })
		.set(item.querySelector(".scope__button p"), {
			duration: 0,
			text: "Понятно",
		})

	item.querySelector(".scope__button").addEventListener("click", function () {
		if (scopeStates[index] === false) {
			timeline.play()
			button.play()

			scopeStates[index] = true
		} else {
			timeline.reverse()
			button.reverse()

			scopeStates[index] = false
		}

		item
			.querySelector(".scope__button-image:nth-child(1)")
			.classList.toggle("scope__button--disabled")
		item
			.querySelector(".scope__button-image:nth-child(2)")
			.classList.toggle("scope__button--disabled")
	})
})
