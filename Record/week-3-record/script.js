// Array Initialization
const marks = [85, 92, 78, 64, 95, 88];

// Function 1: Calculate Average
function calculateAverage(arr) {
    const sum = arr.reduce((acc, curr) => acc + curr, 0);
    return (sum / arr.length).toFixed(2);
}

// Function 2: Filter High Scores (Marks >= 80)
const filterHighScores = (arr) => arr.filter(score => score >= 80);

// Function 3: Find Max and Min Marks
function getMinMax(arr) {
    return {
        max: Math.max(...arr),
        min: Math.min(...arr)
    };
}

// Execution
const avg = calculateAverage(marks);
const topMarks = filterHighScores(marks);
const { max, min } = getMinMax(marks);

// Output to Browser Console
console.log("Original Marks:", marks);
console.log("Average Marks:", avg);
console.log("Top Marks (>= 80):", topMarks);
console.log(`Highest Mark: ${max}, Lowest Mark: ${min}`);
