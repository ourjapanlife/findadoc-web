export const triggerFormValidationErrorMessages = (className: string) => {
    //We are going to find all the inputs from the form to blur them to show errors for inputs with validation
    const inputFieldElements = Array.from(document.body.getElementsByClassName(className) as HTMLCollectionOf<HTMLInputElement>)
    //This will focus and then blur each input so that we can see the error messages on validation
    inputFieldElements.forEach((element: HTMLInputElement) => {
        element.focus()
        element.blur()
    })
}
