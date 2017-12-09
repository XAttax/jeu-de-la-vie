document.addEventListener('DOMContentLoaded', function(event) {
	var canvas = document.getElementById('canvas');
	var contexte = canvas.getContext('2d');

	var cellules = []; // 2 dimensions (X, Y) (Colonne, Ligne)

	var taille = 10;
	var fps = 20;

	var timer = false;
	var mouseDown = false;

	var numEtape = 0;

	var canvasRedimensionner = function() {
		canvas.width = screen.width;
		canvas.height = screen.height;
		contexte.fillStyle = '#fff';
	};

	var creerCellule = function(tab, caseX, caseY) {
		contexte.fillRect(caseX*taille, caseY*taille, taille, taille);

		for(i = 0; i < 3; i++) {
			x = caseX+i-1;

			if(x < 0 || x > Math.ceil(canvas.width/taille))
				continue;

			if(!tab[x])
				tab[x] = [];

			for(j = 0; j < 3; j++) {
				y = caseY+j-1;

				if(y < 0 || y > Math.ceil(canvas.height/taille))
					continue;

				if(!tab[x][y])
					tab[x][y] = x == caseX && y == caseY ? 1 : 0;
			}
		}
	};

	var avancerEtat = function() {
		numEtape++;

		document.getElementById('numEtape').innerHTML = numEtape;

		nouvelleGeneration = [];

		cellules.forEach(function(valeur1, x) {
			if(!nouvelleGeneration[x])
				nouvelleGeneration[x] = [];
			valeur1.forEach(function(valeur, y) {
				nbVoisines = 0;
				supprime = false;

				if(cellules[x-1] !== void 0 && cellules[x-1][y-1] !== void 0 && cellules[x-1][y-1])
					nbVoisines++;
				if(cellules[x] !== void 0 && cellules[x][y-1] !== void 0 && cellules[x][y-1])
					nbVoisines++;
				if(cellules[x+1] !== void 0 && cellules[x+1][y-1] !== void 0 && cellules[x+1][y-1])
					nbVoisines++;
				if(cellules[x-1] !== void 0 && cellules[x-1][y] !== void 0 && cellules[x-1][y])
					nbVoisines++;
				if(cellules[x+1] !== void 0 && cellules[x+1][y] !== void 0 && cellules[x+1][y])
					nbVoisines++;
				if(cellules[x-1] !== void 0 && cellules[x-1][y+1] !== void 0 && cellules[x-1][y+1])
					nbVoisines++;
				if(cellules[x] !== void 0 && cellules[x][y+1] !== void 0 && cellules[x][y+1])
					nbVoisines++;
				if(cellules[x+1] !== void 0 && cellules[x+1][y+1] !== void 0 && cellules[x+1][y+1])
					nbVoisines++;

				// Si il y a une cellule mais qu'elle n'est pas entourée par 2 ou 3 voisines, on la tue
				if(valeur && (nbVoisines < 2 || nbVoisines > 3)) {
					supprime = true;
					contexte.clearRect(x*taille, y*taille, taille, taille);
				}
				// Sinon on peut garder la cellule
				else if(valeur) {
					creerCellule(nouvelleGeneration, x, y);
				}
				// Sinon s'il n'y a pas de cellule mais qu'il y a 3 voisines, on en créer une
				else if(!valeur && nbVoisines == 3) {
					creerCellule(nouvelleGeneration, x, y);
				}
			});
		});

		cellules = nouvelleGeneration;
	};

	var demarrer = function() {
		timer = setInterval(avancerEtat, 1000/fps);
	};

	var arreter = function() {
		clearInterval(timer);
		timer = false;
	};

	var effacer = function() {
		cellules = [];
		contexte.clearRect(0, 0, canvas.width, canvas.height);
		numEtape = 0;
	};

	var aleatoire = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	canvasRedimensionner();

	document.getElementById('canvas').addEventListener('mousedown', function(e) {
		if(timer)
			return false;

		mouseDown = true;
	}, false);

	window.addEventListener('mouseup', function(e) {
		mouseDown = false;
	}, false);

	document.getElementById('canvas').addEventListener('mousemove', function(e) {
		caseX = Math.floor(e.layerX/taille);
		caseY = Math.floor(e.layerY/taille);

		document.getElementById('posX').innerHTML = caseX;
		document.getElementById('posY').innerHTML = caseY;

		if(timer || !mouseDown)
			return false;

		creerCellule(cellules, caseX, caseY);
	});

	document.addEventListener('contextmenu', function(e) {
		e.preventDefault();

		if(timer)
			return false;

		caseX = Math.floor(e.layerX/taille);
		caseY = Math.floor(e.layerY/taille);

		// creerCellule(caseX, caseY);
	}, false);

	document.getElementById('demarrer').addEventListener('click', function(e) {
		demarrer();
	}, false);

	document.getElementById('arreter').addEventListener('click', function(e) {
		arreter();
	}, false);

	document.getElementById('tuer').addEventListener('click', function(e) {
		arreter();
		effacer();
		taille = parseInt(document.getElementById('taille').value);
		fps = parseInt(document.getElementById('fps').value);
	}, false);

	document.getElementById('aleatoire').addEventListener('click', function(e) {
		arreter();
		effacer();

		tabTmp = [];

		for(cx = 0; cx < Math.ceil(canvas.width/taille); cx++) {
			tabTmp[cx] = [];
			nbV = 0;
			for(cy = 0; cy < Math.ceil(canvas.height/taille); cy++) {
				for(vx = 0; vx < 3; vx++) {
					for(vy = 0; vy < 3; vy++) {
						if(vx == cx && vy == cy)
							continue;

						if(tabTmp[cx+vx-1] !== void 0 && tabTmp[cx+vx-1][cy+vy-1] !== void 0 && tabTmp[cx+vx-1][cy+vy-1])
							nbV++;
					}
				}

				rand = nbV == 0 ? aleatoire(0, 20) : aleatoire(0, 1);
				if(rand == 0) {
					tabTmp[cx][cy] = true;
					creerCellule(cellules, cx, cy);
				}
				else
					tabTmp[cx][cy] = false;
			}
		}
	}, false);
});