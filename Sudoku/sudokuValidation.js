
// validation logic: all elements are unique
const _validate = (arr) => {
    const sum = arr.reduce((a, b) => a + b);
    // n(n+1)2 n=9
    if (sum === (9 * 10) / 2) return true;
    else
        return false;
}

const _isRowValidated = (mat) => {
    for (let row of mat) {
        if (!_validate(row)) return false;
    }

    return true;
}

const transposeMatrix = (array) => {
    return array[0].map((col, i) => array.map(row => row[i]));
}

const _isColumnsValidated = (mat) => {
    // transposing matrix to retrieve columns
    const transposedMatrix = transposeMatrix(mat);
    for (let column of transposedMatrix) {
        if (!_validate(column)) return false;
    }

    return true;
}

// getting elements of a 3*3 grid
const _getGridMatrix = (i, j, mat) => {
    const gridMatrix = [];
    for (let p = i; p < i + 3; p++) {
        for (let m = j; m < j + 3; m++) {
            gridMatrix.push(mat[p][m]);
        }
    }
    return gridMatrix;
}

// checking 3*3 grid
const _isGridValidated = (mat) => {
    const gridMatrices = [];
    for (let i = 0; i < mat.length; i = i + 3) {
        for (let j = 0; j < mat.length; j = j + 3) {
            gridMatrices.push(_getGridMatrix(i, j, mat));
        }
    }
    for (let grid of gridMatrices) {
        if (!_validate(grid)) return false;
    }

    return true;

}


function validateSudoku(soduMatrix) {
    // if all 3 conditions pass it is a valid sudoku matrix
    if (_isRowValidated(soduMatrix) &&
        _isColumnsValidated(soduMatrix) && _isGridValidated(soduMatrix)) {
        return true;
    }
    return false;
}

function main() {
    const sudoku_data = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

    validateSudoku(sudoku_data);
}

main();