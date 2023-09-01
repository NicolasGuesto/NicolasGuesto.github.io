import { gsap } from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"

gsap.registerPlugin(ScrollToPlugin)

/**
 * У верхнего меню стоит display: fixed;, поэтому надо учитывать его высоту при
 * скролле. На мобильной и десктопной версии высота разная, поэтому необходимо
 * её посчитать.
 * @returns Высота header для правильного скролла.
 */
let offset
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

/** Список секций сайта. */
let sections = [
	"#heroblock",
	"#education",
	"#mentor",
	"#networking",
	"#levels-system",
	"#request",
]

/** Все кнопки, по нажатию на уоторые будет скролл. */
let selectors = {
	header: ".header__desktop-links a",
	headerMobile: ".header__mobile-links a",
	footer: ".footer__links a",
}

let links = {}

/** Преобразование селекторов в рабочие элементы. */
for (const key in selectors) {
	links[key] = document.querySelectorAll(selectors[key])
}

/** Создание слушателя события для каждой кнопки. */
for (const key in links) {
	for (let i = 0; i < links[key].length; i++) {
		let button = links[key][i]
		button.addEventListener("click", () => {
			gsap.to(window, {
				duration: 1,
				scrollTo: { y: sections[i], offsetY: offset },
			})
		})
	}
}

/** Слушатель собития для кнопки "Вступить" на главном меню. */
document
	.querySelector(".header__submit-button")
	.addEventListener("click", () => {
		gsap.to(window, {
			duration: 1,
			scrollTo: { y: "#request", offsetY: offset },
		})
	})
