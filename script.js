var frameRate = 60;
var ballSize = 50;
var bestScore = 999999;
var window_width = window.innerWidth - 25;
var window_height = window.innerHeight - 25;
var StartPoint = { "x": window_width / 2, "y": window_height - ballSize };
var EndPoint = { "x": window_width / 2, "y": ballSize / 2 };
var timeSinceStart = 0;
var generationTimeInFrames = frameRate * 5; // 5 sec
var generationNumber = 0;
var balls = [];
var bestVectors = {
    x: [],
    y: [],
}

/**
 * This class is following a genetic algorithm
 * 
 * The goal of this experience is to train a ball
 * to go from a start point to an end point.
 */
class Ball {
    constructor(_bestVectors = null) {
        this.size = ballSize;
        this.x = StartPoint.x;
        this.y = StartPoint.y + (ballSize / 2);
        this.vectorsX = [];
        this.vectorsY = [];
        this.score = bestScore;

        //load best vectors from last generation
        if (_bestVectors != null) {
            this.vectorsX = _bestVectors.x;
            this.vectorsY = _bestVectors.y;
        }
    }

    Draw(frame) {
        fill(255);
        this.UpdateVectorsAndPosition(frame);
        this.UpdateScore();
        ellipse(this.x, this.y, this.size, this.size);
    }

    UpdateVectorsAndPosition(frame) {
        // randomize new vectors
        if (this.vectorsX[frame] == null || this.vectorsY[frame] == null) {
            //first generation case
            console.log("first gen");
            this.vectorsX[frame] = parseFloat(random(6) - 3);
            this.vectorsY[frame] = parseFloat(random(6) - 3);
        } else {
            console.log("gen" + generationNumber);
            this.vectorsX[frame] = this.vectorsX[frame] + parseFloat(random(2) - 1);;
            this.vectorsY[frame] = this.vectorsY[frame] + parseFloat(random(2) - 1);;
        }

        if (this.x + this.vectorsX[frame] + this.size >= window_height) {
            this.x -= parseFloat(this.vectorsX[frame]);
        } else {
            this.x += parseFloat(this.vectorsX[frame]);
        }

        if (this.y + this.vectorsY[frame] + this.size >= window_height) {
            this.y -= parseFloat(this.vectorsY[frame]);
        } else {
            this.y += parseFloat(this.vectorsY[frame]);
        }

        //console.log("x: " + this.vectorsX);
        //console.log("y: " + this.vectorsY);
    }

    UpdateScore() {
        var newScore = dist(this.x, this.y, EndPoint.x, EndPoint.y)
        if (newScore < this.score) {
            this.score = newScore;
        }
    }
}

function DrawBases() {
    //starting base
    fill(240, 20, 20);
    rect(StartPoint.x - (ballSize / 2), StartPoint.y, ballSize, ballSize);

    //end point
    fill(20, 240, 20);
    rect(EndPoint.x - (ballSize / 2), EndPoint.y - ballSize / 2, ballSize, ballSize);
}

//~=~=~=~=~=~=~=~=~=~=~=~=
//      SETUP
//~=~=~=~=~=~=~=~=~=~=~=~=
function setup() {
    createCanvas(window_width, window_height);
    noStroke();
    frameRate(frameRate);
}

//~=~=~=~=~=~=~=~=~=~=~=~=
//      DRAW (1 frame)
//~=~=~=~=~=~=~=~=~=~=~=~=
function draw() {
    //if it's a new generation, we recreate a ball

    if (timeSinceStart == 0) {
        for (ball = 0; ball < 50; ball++) {
            balls[ball] = new Ball(bestVectors);
        }

        generationNumber++;
    }

    background(0);
    DrawBases();
    timeSinceStart++;
    text("duration: " + timeSinceStart + "\tgeneration: " + generationNumber, 20, 20);

    //~=~=~=~=~=~=~=~=~=~=~=~=
    //  Calculate best genome
    //~=~=~=~=~=~=~=~=~=~=~=~=
    ScoreArray = [];
    balls.forEach(ball => {
        ScoreArray.push(parseFloat(ball.score));
    });
    var maxScoreFound = ScoreArray.reduce(function (a, b) {
        return Math.min(a, b);
    });
    bestScore = maxScoreFound;
    var indexOfBest = ScoreArray.indexOf(Math.max(maxScoreFound));
    text("vectorX: " + parseInt(balls[indexOfBest].vectorsX[timeSinceStart]) + "\nvectorY: " + parseInt(balls[indexOfBest].vectorsY[timeSinceStart]), 20, 90);
    text("bestScore: " + bestScore + "\nbestIndex: " + indexOfBest, 20, 50);

    //~=~=~=~=~=~=~=~=~=~=~=~=
    //  Check for new generation
    //~=~=~=~=~=~=~=~=~=~=~=~=
    //if delay is not expired
    if (timeSinceStart < generationTimeInFrames) {
        //ball
        balls.forEach(ball => {
            ball.Draw(timeSinceStart);
        });
    } else {
        bestVectors.x = balls[indexOfBest].vectorsX;
        bestVectors.y = balls[indexOfBest].vectorsY;

        timeSinceStart = 0;
    }

    if (bestScore <= 1) {
        alert("You win");
    }
}