const COLORS = ["255,108,80", "5,117,18", "29,39,57", "67,189,81"]; /*заведем глобальную переменную с цветами пузырьков*/
const BUBBLE_DENSITY = 50; /* Количество пузырьков*/

function generateDecimalBetween(left, right) { /* ф-я помошник получения случ.числа */
   return (Math.random() * (left - right) + right).toFixed(2); /* получить число в промежутке от left до right, 
   а затем с помощью метода toFixed(2) мы оставляем от числа два знака после запятой.*/
}

class Bubble {
   constructor(canvas) {
      this.canvas = canvas;
      this.getCanvasSize(); /*getCanvasSize берет из холста его размеры и сохраняет в переменные внутри класса Bubble.*/
      this.init();
   }

   getCanvasSize() {
      this.canvasWidth = this.canvas.clientWidth;
      this.canvasHeight = this.canvas.clientHeight;
   }


   /* метод будет инициализировать пузырек*/
   init() {
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)] /* зачем нам свойство color? у Math.random такой синтаксисис от 0 до (*) Числа*/
      this.size = generateDecimalBetween(1, 3); /*обозн. св-ва size класса случайным числом от 1 до 3. */
      this.alfa = generateDecimalBetween(5, 10) / 10; /* обозначение св-ва alfa от 5 до 10 и / на 10, т.к. alpha-прозрачность, которая от 0 до 1. */
      this.translateX = generateDecimalBetween(0, this.canvasWidth); /*обознач. нач. поз. пузырька, x-координата от 0 до ширины холста*/
      this.translateY = generateDecimalBetween(0, this.canvasHeight); /*y-координата* от 0 до высоты холста*/
      this.velocity = generateDecimalBetween(20, 40); /*свойствоскорости движения пузырька */
      this.movementX = generateDecimalBetween(-2, 2) / this.velocity; /*дельту перемещения точки по оси x и по оси y. */
      this.movementY = generateDecimalBetween(1, 20) / this.velocity; /*На это число мы будем все время смещать позицию пузырька*/
   }

   /*обновляnь x- и y-координаты нашего пузырька на значения movementX и movementY*/
   move() {
      this.translateX = this.translateX - this.movementX;
      this.translateY = this.translateY - this.movementY;
      /*x- и y-координаты пост. умень-ся и могут выйти за холст. вернуть их обратно на холст*/
      if (this.translateY < 0 || this.translateX < 0 || this.translateX > this.canvasWidth) {
         this.init();
         this.translateY = this.canvasHeight;
      }
   }
}

/*Конструктор принимает на вход id, это будет id-атрибут тега холста, по которому мы будем получать этот элемент.
Метод start запустит анимацию: подстроит размеры холста, создаст пузырьки и анимирует их*/

class CanvasBackground {
   constructor(id) {
      this.canvas = document.getElementById(id)
      this.ctx = this.canvas.getContext("2d");
      this.dpr = window.devicePixelRatio;
   }
   /*выставить ширину и высоту холста и настроить масштаб, это мы сделаем в методе canvasSize.
   Далее надо сгенерировать пузырьки, это мы сделаем в методе generateBubbles.
   И последнее — запустить анимацию, для этого вызовем метод animate*/
   start() {
      this.canvasSize();
      this.generateBubbles();
      this.animate();
   }
   canvasSize() {
      this.canvas.width = this.canvas.offsetWidth * this.dpr; // равна ширине холста 
      this.canvas.height = this.canvas.offsetHeight * this.dpr; // равна высоте холста
      /*ширину и высоту умножили на devicePixelRatio (this.dpr) чтобы графика не отображалась мутно на мониторах с более высоким разрешением*/
      this.ctx.scale(this.dpr, this.dpr); /* Для контекста (this.ctx) выставили масштаб, равный devicePixelRatio*/
   }
   generateBubbles() {
      this.bubblesList = [];
      /*В массив bubblesList добавьте экземпляры класса Bubble (new Bubble(...)) в количестве = BUBBLE_DENSITY
      с аргументом - элемент холста (this.canvas).*/
      for (let i = 0; i < BUBBLE_DENSITY; i++) {
         this.bubblesList.push(new Bubble(this.canvas))
      }
   }
   animate() {
      this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight); /*Очистить холст */

      this.bubblesList.forEach((bubble) => { /*Для каждого элемента класса Bubble Вычислим новую позицию пузырька */
         bubble.move();
         this.ctx.translate(bubble.translateX, bubble.translateY); /*изменить позицию пузырька*/
         this.ctx.beginPath(); /*отрисовку нового пути пузырька*/
         this.ctx.arc(0, 0, bubble.size, 0, 2 * Math.PI); /*нарисуйте круг с центром 0,0 радиусом bubble.size из точки 0 длиной 2Пи*/

         /* ГДЕ ТО ОШИБКА, ПУЗЫРЬКИ ЧЕРНЫЕ */
         this.ctx.fillStyle = "rgba(50, 200, 50, 1)"; /* "rgba(" + bubble.color + "," + bubble.alpha + ")"; закрасьте круг нужным цветом*/
         this.ctx.fill(); /*Закрасьте пузырек, вызвав метод fill у контекста*/
         this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); /*Настроить масштабирование, чтобы размер пузырька отрисовался согласно размерам холста*/
      });
      requestAnimationFrame(this.animate.bind(this));
   }
}
const canvas = new CanvasBackground("orb-canvas");
canvas.start();