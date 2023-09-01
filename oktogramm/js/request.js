import { gsap } from "gsap"

let requestPage = 0

let mainSelector = ".request__main-container"

/** Список используемых селекторов. */
let selectors = {
	mainRight: " .request__main-right",
	socialMedia: " .request__right-social-media",
	beforeButton: " .request__button--before",
	afterButton: " .request__button--after",
	input: " .input",
	inputField: " .input__field",
	inputText: " .input__label",
	rightHeader: " .request__right-header h4",
	firstResult: " .request__result--first",
	resultData: " .request__result-data",
	resultSocial: " .request__result-social",

	leftImage: " .request__left-image",
	leftText: " .request__left-header h3",
	bar: " .request__left-bar",
}

let request = {}

/** Преобразование селекторов в элементы, с которыми можно взаимодействовать. */
for (const key in selectors) {
	request[key] = document.querySelectorAll(mainSelector + selectors[key])
}

/**
 * Смена блока у правой стороны заявки.
 * @param {number} step - Направление движения блока. Положительное или отрицательное число.
 */
function changeRight(step) {
	let rightAnimation = gsap
		.timeline({ paused: true })
		.to(request.mainRight[requestPage], { duration: 0.25, autoAlpha: 0 })
		.to(request.mainRight[requestPage + step], { duration: 0.25, autoAlpha: 1 })

	rightAnimation.play()
}

/**
 * Смена блока у левой стороны заявки.
 * @param {number} step - Направление движения блока. Положительное или отрицательное число.
 */
function changeLeft(step) {
	let barColor = step > 0 ? "#f63" : "#373737"
	let barStep = step > 0 ? requestPage + step : requestPage

	let leftAnimation = gsap
		.timeline({ paused: true })
		.to(request.leftImage[requestPage], { duration: 0.25, autoAlpha: 0 })
		.to(request.leftText[requestPage], { duration: 0.25, autoAlpha: 0 }, "<")
		.to(
			request.bar[barStep],
			{
				duration: 0.5,
				backgroundColor: barColor,
			},
			"<"
		)
		.to(
			request.leftImage[requestPage + step],
			{ duration: 0.25, autoAlpha: 1 },
			"0.25"
		)
		.to(
			request.leftText[requestPage + step],
			{ duration: 0.25, autoAlpha: 1 },
			"<"
		)

	leftAnimation.play()
	leftAnimation.eventCallback("onComplete", toggleAnimation)

	if (step === -2) {
		gsap.to(
			request.bar[1],
			{
				duration: 0.5,
				backgroundColor: barColor,
			},
			"<"
		)
	}
}

let animation = false

/** Отключение возможности нажимать кнопку во время анимации. */
function toggleAnimation() {
	animation = false
}

/**
 * Одновременная смена левой и правой стороны заявки. В этой функции происходит вычисление шага - step.
 * @param {boolean} reverse - Направление движения вперед или назад.
 */
function changePage(reverse) {
	let step = reverse ? -1 : 1
	animation = true

	if (!reverse && requestPage === 2) {
		step = -2
	}

	changeLeft(step)
	changeRight(step)
	requestPage += step
}

let socialButtons = ["Telegram", "Вконтакте", "Element", "WhatsApp", "SMS"]

/** Сброс всех полей ввода. */
function inputToDefault() {
	let [firstInputField, secondInputField, thirdInputField] = request.inputField

	firstInputField.value = ""
	secondInputField.value = ""
	thirdInputField.value = ""

	request.inputText[0].textContent = "Номер телефона"
	firstInputField.classList.add("phone")
}

/** Спрособ обратной связи, выбранный в данный момент. */
let nowSelectedSocial

/**
 * Изменение input-ов в зависимочти от выбранной социальной сети.
 * @param {string} selectedSocial - Выбранная социальная сеть.
 */
function changeInput(selectedSocial) {
	let inputText = request.inputText[0]
	let inputField = request.inputField[0]
	inputToDefault()

	request.rightHeader[1].textContent = selectedSocial
	request.rightHeader[2].textContent = selectedSocial

	if (
		selectedSocial === "Telegram" ||
		selectedSocial === "Вконтакте" ||
		selectedSocial === "Element"
	) {
		inputText.textContent = "Ссылка или никнейм"
		inputField.classList.remove("phone")
	}

	nowSelectedSocial = selectedSocial
}

let inputPosition = 0

/** Маска и валидация для поля ввода номера телефона. */
;[].forEach.call(document.querySelectorAll(".phone"), function (input) {
	let keyCode

	function mask(event) {
		if (!request.inputField[0].classList.contains("phone")) {
			if (this.value.length >= 5) {
				isSubmitActive(true)
			} else {
				isSubmitActive(false)
			}

			return
		}

		event.keyCode && (keyCode = event.keyCode)
		inputPosition = this.selectionStart

		if (inputPosition < 3) event.preventDefault()
		let matrix = "+7 (___) ___ __ __",
			i = 0,
			def = matrix.replace(/\D/g, ""),
			val = this.value.replace(/\D/g, ""),
			new_value = matrix.replace(/[_\d]/g, function (a) {
				return i < val.length ? val.charAt(i++) || def.charAt(i) : a
			})
		i = new_value.indexOf("_")
		if (i !== -1) {
			i < 5 && (i = 3)
			new_value = new_value.slice(0, i)
		}
		let reg = matrix
			.substr(0, this.value.length)
			.replace(/_+/g, function (a) {
				return "\\d{1," + a.length + "}"
			})
			.replace(/[+()]/g, "\\$&")
		reg = new RegExp("^" + reg + "$")
		if (
			!reg.test(this.value) ||
			this.value.length < 5 ||
			(keyCode > 47 && keyCode < 58)
		)
			this.value = new_value
		if (event.type === "blur" && this.value.length < 5) this.value = ""

		if (this.value.length === 18) {
			isSubmitActive(true)
		} else {
			isSubmitActive(false)
		}
	}

	input.addEventListener("input", mask, false)
	input.addEventListener("focus", mask, false)
	input.addEventListener("blur", mask, false)
	input.addEventListener("keydown", mask, false)
})

/**
 * Переключение состояния кнопки активна/не активна. Кнопка активируется при успешной валидации данных в форме.
 * @param {boolean} status - Статус проверки введёных данных. Если всё правильно, то будет true.
 */
function isSubmitActive(status) {
	let submitButton = request.afterButton[0]

	if (status) {
		submitButton.classList.remove("request__button--after--disabled")
		submitButton.style.color = "#fff"
	} else {
		submitButton.classList.add("request__button--after--disabled")
		submitButton.style.color = "#525252"
	}
}

/**
 * Изменение данных на последней странице.
 */
function changeResultData() {
	let [firstField, secondField, thirdField] = request.inputField
	let [firstResult, secondResult, thirdResult] = request.resultData

	if (firstField.value.trim() === "") {
		request.firstResult.style.display = "none"
	} else {
		request.resultSocial[0].textContent = nowSelectedSocial
		firstResult.textContent = firstField.value
	}

	if (secondField.value.trim() === "") {
		secondResult.textContent = "Не указано"
	} else {
		secondResult.textContent = secondField.value
	}

	if (thirdField.value.trim() === "") {
		thirdResult.textContent = "Не указано"
	} else {
		thirdResult.textContent = thirdField.value
	}
}

/** Обработчики для кнопок */
for (let index = 0; index < socialButtons.length; index++) {
	let selectedSocial = socialButtons[index]

	request.socialMedia[index].addEventListener("click", () => {
		if (animation) {
			return
		}

		changeInput(selectedSocial)
		changePage(false)
	})
}

for (const button of request.beforeButton) {
	button.addEventListener("click", function () {
		if (animation) {
			return
		}

		changePage(true)
	})
}

for (const button of request.afterButton) {
	button.addEventListener("click", function () {
		let submitButton = request.afterButton[0]

		if (!submitButton.classList.contains("request__button--after--disabled")) {
			if (animation) {
				return
			}

			changeResultData()
			changePage(false)
		}
	})
}
