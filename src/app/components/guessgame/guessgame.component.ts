import { UpperCasePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnInit, QueryList, RendererFactory2, signal,  ViewChild, ViewChildren, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-guessgame',
  standalone: true,
  imports: [UpperCasePipe, FormsModule],
  templateUrl: './guessgame.component.html',
  styleUrl: './guessgame.component.scss'
})
export class GuessgameComponent implements OnInit , AfterViewInit{
  // Inject Rendrere2 To Access DOM
  private readonly _Renderer2 = inject(RendererFactory2).createRenderer(null,null)

  // Setting Game Options
  numberOfTries:WritableSignal<number[]> = signal(Array(6).fill(null))
  numberOfLetters:WritableSignal<string[]> = signal(Array(6).fill(null))
  currentTry:number = 1
  numberOfHints:number = 2
  guessWord:WritableSignal<string> = signal("")
  words:string[] = ['Animal', 'Answer', 'Change', 'Couple', 'Advice', 'Corner', 'Common', 'Beaker', 'Doctor','Choice', 'Design', 'Budget', 'Career','Driver','Effect', 'Dinner', 'Anyway','Always','Client','Active', 'Course','Assist', 'Centre','Damage', 'Danger', 'August', 'Author', 'Beauty', 'Degree', 'Coming', 'Belief','Detect','Desire']
  successWord:WritableSignal<boolean> = signal(true)
  msgWin:WritableSignal<string> = signal('')
  msgLose:WritableSignal<string> = signal('')

  // All Divs And Inputs And Buttons
  @ViewChildren('inputs') inputsContainer!:QueryList<ElementRef>
  @ViewChildren('input') allInputs!:QueryList<ElementRef>
  @ViewChild('check') checkBtn!:ElementRef
  @ViewChild('hint') hintBtn!:ElementRef

  // Suffle Words When Page Load
  ngOnInit(): void {
    this.shuffleWord()
  }

  // Focus First Input And Disabled All Inputs When Load Page
  ngAfterViewInit(): void {
    this.disabledAllInput()
  }

  // Focus First Input And Disabled All Inputs
  disabledAllInput() {
    this.inputsContainer.forEach((item, index)=>{
      let childrenInputs:any = Array.from(item.nativeElement.children)
      childrenInputs.slice(1).forEach((input:any) => {
        this.removeClass(item.nativeElement, 'stopEvent')
        this.enableInput(input)
        this.removeClass(input,'stopEvent')
      });
      if(index !== 0){
        childrenInputs.slice(1).forEach((input:any) => {
          this.addClass(item.nativeElement, 'stopEvent')
          this.disabledInput(input)
        });
      } else {

      }
    })
    this.allInputs.get(0)?.nativeElement.focus()

  }

  // Remove Disabled Attr In Inputs
  enableInput(input:any){
    this._Renderer2.removeAttribute(input, 'disabled')
  }

  // Add Disabled Attr In Inputs
  disabledInput(input:any){
    this._Renderer2.setAttribute(input, 'disabled', 'true')
  }

  // Add Class In Div Container Inputs
  addClass(input:any, className:string){
    this._Renderer2.addClass(input, className)
  }

  // Add Class In Div Container Inputs
  removeClass(input:any, className:string){
    this._Renderer2.removeClass(input,className)
  }

  // Manage Game => Remove Disabled In Current Input And Add In Another Inputs
  perpareNextRound(currentTry: number){
    let currentContainer = this.inputsContainer.get(currentTry - 1)?.nativeElement
    let nextContainer = this.inputsContainer.get(currentTry)?.nativeElement

    let currentInput = Array.from(currentContainer.children).slice(1)
    currentInput.forEach((input:any)=>{
      this.disabledInput(input)
      this.addClass(input, 'stopEvent')
    })

    if(nextContainer){
      let nextInput:any = Array.from(nextContainer.children).slice(1)
      nextInput.forEach((input:any, i:number)=>{
        this.enableInput(input)
      })
      nextInput[0].focus()
      this.removeClass(nextContainer,'stopEvent')
    } else {
      this.disabledInput(this.checkBtn.nativeElement)
      this.disabledInput(this.hintBtn.nativeElement)
      this.msgLose.set(`Your Lose The Word Is ${this.guessWord().toUpperCase()}`)
      setTimeout(()=>{
        this.resetGame()
      }, 1500)
    }
  }

  // Shuffle Letters Word
  shuffleWord(){
    for (let i = 0; i < this.words.length; i++) {
      this.guessWord.set(this.words[Math.floor(Math.random() * this.words.length)].toLowerCase())
    }
  }

  // Move Right And Left By Keyboard Arrow And BackSpace
  moveRightAndLeft(event:any){
    let inputs = Array.from(this.allInputs)
    let currentIndex = inputs.map(input => input.nativeElement).indexOf(event.target)

    if(inputs.map(input => input.nativeElement)){
      if(event.key === 'ArrowRight'){
        let nextInput = currentIndex + 1
        if(nextInput < inputs.length) inputs[nextInput].nativeElement.focus()
      }
      if(event.key === 'ArrowLeft'){
        const prevIndex = currentIndex - 1
        if(prevIndex >= 0) inputs[prevIndex].nativeElement.focus()
      }

      if (event.key === 'Backspace') {
        if(event.target.value === ''){
          const prevIndex = currentIndex - 1
          if(prevIndex >= 0){
            inputs[prevIndex].nativeElement.focus()
            inputs[prevIndex].nativeElement.value = ''
          }
        } else {
          event.target.value = ''
        }
      }

    }
  }

  // Convert Words ToUpperCase And Fouce On Next Input
  convertInputValue(event:any){
    let inputs = Array.from(this.allInputs)
    let currentIndex = inputs.map(input => input.nativeElement).indexOf(event.target)

    event.target.value = event.target.value.toUpperCase()
    if(inputs.map(input => input.nativeElement)){
      let nextInput = inputs[currentIndex + 1].nativeElement
      if (nextInput) nextInput.focus()
    }
  }

  // Logic Game In All Stats
  logicGame(){
    let arrInputs = Array.from(this.inputsContainer.get(this.currentTry - 1)?.nativeElement.children).slice(1)
    const guessWord = this.guessWord()
    this.successWord.set(true)

    arrInputs.forEach((input:any , i:number)=>{
      let letter = input.value.toLowerCase()
      let actualLetter = guessWord[i]
      if(letter === actualLetter){
        this.addClass(input, 'in-place');
      } else if(guessWord.includes(letter) && letter !== ''){
        this.addClass(input, 'not-place');
        this.successWord.set(false);
      } else {
        this.addClass(input, 'not');
        this.successWord.set(false);
      }
    })

    if(this.successWord()){
      this.msgWin.set(`Your Win The Word Is ${this.guessWord().toUpperCase()}`)
      this.allInputs.forEach( (input) => { this.disabledInput(input.nativeElement) })
      this.disabledInput(this.checkBtn.nativeElement)
      this.disabledInput(this.hintBtn.nativeElement)
      setTimeout(()=>{
        this.resetGame()
      }, 1500)
    } else {
      this.perpareNextRound(this.currentTry);
      this.currentTry++
    }
  }

  // Manage Hints
  getHint(){
    if(this.numberOfHints > 0){
      this.numberOfHints--
    }

    if(this.numberOfHints === 0){
      this.disabledInput(this.hintBtn.nativeElement)
    }

    let enableInputs = this.allInputs.filter(input => !input.nativeElement.hasAttribute('disabled'))
    let emptyEnableInput = enableInputs.map(input => input.nativeElement).filter(input => input.value === '')

    if(emptyEnableInput.length > 0){
      let randomIndex = Math.floor(Math.random() * emptyEnableInput.length)
      let randomInput = emptyEnableInput[randomIndex]
      let indexToFill = enableInputs.map(input => input.nativeElement).indexOf(randomInput)
      console.log(randomIndex);
      console.log(randomInput);
      console.log(indexToFill);
      if(indexToFill !== -1){
        randomInput.value = this.guessWord()[indexToFill].toUpperCase()
      }
    }

  }

  // Reset
  resetGame(){
    let inputs = Array.from(this.allInputs).map(input=> input.nativeElement)
    inputs.forEach((input)=>{
      input.value = ''
      this.removeClass(input,'in-place')
      this.removeClass(input,'not-place')
      this.removeClass(input,'not')
    })

    this.enableInput(this.checkBtn.nativeElement)
    this.enableInput(this.hintBtn.nativeElement)

    this.currentTry = 1
    this.successWord.set(false)
    this.msgLose.set('')
    this.msgWin.set('')

    this.shuffleWord()
    console.log(this.guessWord());

    this.disabledAllInput()
  }

}
