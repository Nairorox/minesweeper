const gameWindow = document.querySelector('main');
const restartButton = document.querySelector('.btn-restart');
let gameStarted = false;


class Game{
	constructor(){
		this.size = 15;
		this.dom = gameWindow;
		this.fields = [];
		this.minesQuanity = 15;
		this.flags = this.minesQuanity;
		this.mines = [];
		this.finished = false;
		this.score = 0;
	}

	restart(){
		gameStarted = false;
		while(this.dom.children.length > 0){
			this.dom.removeChild(this.dom.firstChild);
		}
		this.fields = [];
		this.flags = this.minesQuanity;
		this.mines = [];
		this.score = 0;
		this.finished = false;
		this.start();
	}

	clickHandler(e){
		if(!game.finished){
			this.check();
		}
	}

	createFields(){
		for(var i=0 ; i < this.size ** 2; i++){
			new Field();
		}
	}

	contextMenuHandler(e){
		e.preventDefault();
		if(!game.finished){
			this.toggleFlag();
		}
	}

	createFieldsDom(){
		let squareWidth = Math.sqrt(this.fields.length);
		for(var i = 0; i < this.fields.length; i++){
			let fieldDom = document.createElement('div');
			fieldDom.classList.add('field');
			fieldDom.style.width = `${100 / squareWidth}%`;
			fieldDom.style.height = `${100 / squareWidth}%`;
			this.fields[i].dom = fieldDom;
			this.dom.appendChild(fieldDom);
			fieldDom.addEventListener('click', this.clickHandler.bind(this.fields[i]));
			fieldDom.addEventListener('contextmenu', this.contextMenuHandler.bind(this.fields[i]));
		}
	}

	setMatrix(){
		this.matrix = [];
		let counter = 0;
		for(var i = 0; i < this.size; i++){
			let row = [];
			for(var j = 0; j < this.size; j++){
				this.fields[counter].xPos = i;
				this.fields[counter].yPos = j;
				row.push(this.fields[counter]);
				counter += 1;
			}
			this.matrix.push(row);
		}
	}

	setRandomMines(){
		while (this.mines.length < this.minesQuanity){
			let randomIndex = Math.floor(Math.random()*this.fields.length);
			if(!this.mines.includes(this.fields[randomIndex])){
				this.fields[randomIndex].isMine = true;
				this.mines.push(this.fields[randomIndex]);
			}
		}
	}

	setValues(){
		let minesAround = 0;
		for(var i = 0; i < this.mines.length; i++){
			let minX = this.mines[i].xPos - 1 < 0 ? 0 : this.mines[i].xPos -1;
			let minY = this.mines[i].yPos - 1 < 0 ? 0 : this.mines[i].yPos -1;
			let maxX = this.mines[i].xPos + 1 > this.size.length ? this.size.length - 1 : this.mines[i].xPos + 1;
			let maxY = this.mines[i].yPos + 1 > this.size.length ? this.size.length - 1 : this.mines[i].yPos + 1;

			for(var j = minX; j < maxX + 1; j++){
				for(var k = minY; k < maxY + 1; k++){
					if(this.matrix[j] && this.matrix[j][k] && !this.matrix[j][k].isMine){
						this.matrix[j][k].addMine();
					}
				}
			}
		}
	}

	start(){
		if(!gameStarted){
			this.createFields();
			this.createFieldsDom();
			this.setRandomMines();
			this.setMatrix();
			this.setValues();
			gameStarted = true;
		}
	}
}

class Field{
	constructor(){
		this.isMine = false;
		this.dom = null;
		this.game = game;
		this.game.fields.push(this);
		this.minesAround = 0;
		this.checked = false;
	}

	addMine(){
		this.minesAround += 1;
	}

	checkOthers(el){
		let minX = el.xPos - 1 < 0 ? 0 : el.xPos -1;
		let minY = el.yPos - 1 < 0 ? 0 : el.yPos -1;
		let maxX = el.xPos + 1 > game.size.length ? game.size.length - 1 : el.xPos + 1;
		let maxY = el.yPos + 1 > game.size.length ? game.size.length - 1 : el.yPos + 1;

		for(var j = minX; j < maxX + 1; j++){
			for(var k = minY; k < maxY + 1; k++){
				if(game.matrix[j] && game.matrix[j][k] && !game.matrix[j][k].isMine && game.matrix[j][k].minesAround === 0 && !game.matrix[j][k].checked){
					game.matrix[j][k].checked = true;
					game.matrix[j][k].dom.style.backgroundColor = 'gray';
					this.checkOthers(game.matrix[j][k]);

					if(game.matrix[j][k].flagged){
						game.matrix[j][k].toggleFlag();
					}
				}
			}
		}
	}

	toggleFlag(){
		if(!this.checked){
			if(this.flagged){
				game.flags += 1;
				this.dom.style.backgroundColor = '';
			}
			else{
				if(game.flags > 0){
					game.flags -= 1;
					this.dom.style.backgroundColor = 'red';
				}
			}
			this.flagged = !this.flagged;
			if(game.mines.every(mine => {	//winning
				return mine.flagged;
			})){
				alert(`You've won!`);
				game.finished = true;
			}
		}
	}

	check(e){
		if(!this.flagged && !this.checked && !game.finished){	
			this.checked = true;
			if(this.isMine){
				this.dom.classList.add('mine');
				//game over
				game.fields.forEach(field =>{
					field.check();
					if(field.flagged && field.isMine){
						field.dom.innerText = "X"
					}
				});
				game.finished = true;
			} 
			else if(this.minesAround > 0){
				this.dom.innerText = this.minesAround;
			}
			else{
				this.dom.style.backgroundColor = 'gray';
				this.checkOthers(this);
			}
		}
	}
}

const game = new Game()
game.start();

restartButton.addEventListener('click', function(){
	game.restart();
})
/*
	document.addEventListener('keydown', function(e){
		if(e.code === 'Space' || e.code === 'Enter'){
			game.restart();
		}
	})
*/