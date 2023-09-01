import { gsap } from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin)

let offset

/**
 * У верхнего меню стоит display: fixed;, поэтому надо учитывать его высоту при
 * скролле. На мобильной и десктопной версии высота разная, поэтому необходимо
 * её посчитать.
 * @returns Высота header для правильного скролла.
 */
function checkWindowWidth() {
	if (window.innerWidth < 850) {
		offset = 125
	} else {
		offset = 87
	}
	return offset
}

/** Запуск функции просчёта при загрузке страницы. */
checkWindowWidth()

document.querySelector(".heroblock__about").addEventListener("click", () => {
	gsap.to(window, {
		duration: 0.5,
		scrollTo: { y: "#education", offsetY: offset },
	})
})

/** Изменение состояния видео на паузу, когда оно вне зоны видимости. */
const video = document.querySelector(".heroblock__video")
ScrollTrigger.create({
	start: "top center",
	end: "bottom bottom",
	trigger: ".education",
	onEnter: () => video.play(),
	onLeave: () => video.pause(),
	onEnterBack: () => video.play(),
})
