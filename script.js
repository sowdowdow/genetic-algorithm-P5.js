var frameRate = 60;
var ballSize = 50;
var bestScore = Infinity;
var moveDuration = 6;
var maxSpeed = 6;
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
        this.radius = ballSize / 2;
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
        // if (frame % moveDuration == 0) {
        //     alert("gre")
        // }
        this.UpdateVectors(frame);
        this.UpdatePositions(frame);
        this.UpdateScore();
        fill(255);
        ellipse(this.x, this.y, this.size, this.size);
    }
    UpdatePositions(frame) {
        //borders limits
        if (this.y + this.radius >= window_height) {
            this.y = window_height - this.radius;
        }
        if (this.x + this.radius >= window_width) {
            this.x = window_width - this.radius;
        }

        //movements
        this.x += parseFloat(this.vectorsX[frame]);
        this.y += parseFloat(this.vectorsY[frame]);
    }
    UpdateVectors(frame) {
        // randomize new vectors
        // first generation case
        if (this.vectorsX[frame] == null || this.vectorsY[frame] == null) {
            // if a previous vector exists
            if (this.vectorsX[frame - 1] && this.vectorsY[frame - 1]) {
                this.vectorsX[frame] = this.vectorsX[frame - 1] * random(-1, 1);
                this.vectorsY[frame] = this.vectorsY[frame - 1] * random(-1, 1);
            } else {
                //the really first vector
                this.vectorsX[frame] = random(-5, 5);
                this.vectorsY[frame] = random(-5, 5);
            }
        } else {

            //~=~=~=~=~=~=~=~=~=~=~=~=
            // CONTROL OF SPEED
            //~=~=~=~=~=~=~=~=~=~=~=~=
            if (this.vectorsX[frame] > 6 || this.vectorsX[frame] < -6) {
                if (this.vectorsX[frame] > 6) {
                    this.vectorsX[frame] = 6;
                }
                if (this.vectorsX[frame] < -6) {
                    this.vectorsX[frame] = -6;
                }
            } else {
                //randomizing speed
                this.vectorsX[frame] = parseFloat(this.vectorsX[frame] + random(-3, 3));
            }
            if (this.vectorsY[frame] > 6 || this.vectorsY[frame] < -6) {
                if (this.vectorsY[frame] > 6) {
                    this.vectorsY[frame] = 6;
                }
                if (this.vectorsY[frame] < -6) {
                    this.vectorsY[frame] = -6;
                }
            } else {
                this.vectorsY[frame] = parseFloat(this.vectorsY[frame] + random(-3, 3));
            }
        }
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
        for (ball = 0; ball < 1000; ball++) {
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