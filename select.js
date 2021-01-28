export default class Select {
    constructor(selectElement){

        this.selectElement = selectElement;
        this.options = getFormattedOptions(selectElement.querySelectorAll('option'))
        //wrapper element by div
        this.customElement = document.createElement('div')
        //current label of  the box 
        this.labelElement = document.createElement('span')
        //option element
        this.optionCustomElement = document.createElement("ul")
        setupCustomElement(this);
        selectElement.style.display = "none"
        selectElement.after(this.customElement)
    }

    get selectedOption(){
        return this.options.find(option => option.selected)
    }

    get selectedOptionIndex(){
        return this.options.indexOf(this.selectedOption)
    }

    selectValue(value){
        const newSelectOption = this.options.find(option =>{
            return option.value === value
        })

        const preSelectOption = this.selectedOption
        preSelectOption.selected = false
        preSelectOption.element.selected = false

        newSelectOption.selected = true
        newSelectOption.element.selected = true

        this.labelElement.innerText = newSelectOption.label
        this.optionCustomElement.querySelector(`[data-value="${preSelectOption.value}"]`).classList.remove('selected')
        
        const newCustomElement = this.optionCustomElement.querySelector(`[data-value="${newSelectOption.value}"]`)

        newCustomElement.classList.add('selected')
        newCustomElement.scrollIntoView({block: "nearest"})
    }
} 

function setupCustomElement(select){
    select.customElement.classList.add('custom-select-container')
    // make it able to focus
    select.customElement.tabIndex = 0

    select.labelElement.classList.add('custom-select-value')
    select.labelElement.innerText = select.selectedOption.label
    select.customElement.append(select.labelElement)

    select.optionCustomElement.classList.add('custom-select-options')
    select.options.forEach(option => {
            const optionElement = document.createElement('li')
            optionElement.classList.add('custom-select-option')
            optionElement.classList.toggle('selected',option.selected)
            optionElement.innerText = option.label
            optionElement.dataset.value = option.value
            optionElement.addEventListener('click',()=>{
                 select.selectValue(option.value)
                // when we click we hide the dropdown
                select.optionCustomElement.classList.remove('show')
            })
            select.optionCustomElement.append(optionElement)
    });
    select.customElement.append(select.optionCustomElement)

    select.labelElement.addEventListener('click', ()=>{
        select.optionCustomElement.classList.toggle('show')
    })

    select.customElement.addEventListener('blur', ()=>{
        select.optionCustomElement.classList.remove('show')
    })


    let debounceTimeout
    let searchTerm = ""
    select.customElement.addEventListener('keydown', e=>{

        switch(e.code){
            case "Space":
                select.optionCustomElement.classList.toggle('show')
                break
            case "ArrowUp":
                const prevOption = select.options[select.selectedOptionIndex-1]
                if (prevOption){
                    select.selectValue(prevOption.value)
                }
                break
            case "ArrowDown":
                const nextOption = select.options[select.selectedOptionIndex +1]
                if (nextOption){
                    select.selectValue(nextOption.value)
                }
                break
            case "Enter":
                case "Escape":
                    select.optionCustomElement.classList.remove('show')
            
            // search box 
            default:
                clearTimeout(debounceTimeout)
                searchTerm += e.key
                debounceTimeout = setTimeout(() =>{
                    searchTerm = ""
                },500)
                
                const searchedOption = select.options.find(option =>{
                   return  option.label.toLowerCase().startsWith(searchTerm)
                })
                if (searchedOption) select.selectValue(searchedOption.value)
        }

    })


}

function getFormattedOptions(optionElments){
    return [...optionElments].map(option => {
        return{
            value:option.value,
            label:option.label,
            selected:option.selected,
            element:option
        }
    })

}