import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, ImageBackground, Alert } from 'react-native';
import bg from './assets/board.png'
import Cell from './src/components/Cell'

const copyArray = (original) => {
  const copy = original.map((arr) => {
    return arr.slice();
  });
  return copy;
}

export default function App() {

  const emptyMap = [
    ['', '', ''], // 1st row
    ['', '', ''], // 2nd row
    ['', '', ''], // 3rd row
  ];
  const [map, setMap] = useState(emptyMap);
  const [currentTurn, setCurrentTurn] = useState('x');
  const [gameMode, setGameMode] = useState("LOCAL"); // LOCAL, EASY, MEDIUM, HARD;

  useEffect(() => {
    const winner = getWinner(map);
    if (winner) {
      gameEnd(winner);
    } else if (currentTurn == 'o' && gameMode !== "LOCAL") {
      botTurn();
    }
  }, [map, currentTurn, gameMode]);

  const onPress = (rowIndex, columnIndex) => {

    if (map[rowIndex][columnIndex] != '') {
      Alert.alert("Position already occupied");
      return;
    }

    setMap((existingMap) => {
      const updatedMap = [...existingMap]
      updatedMap[rowIndex][columnIndex] = currentTurn;
      return updatedMap;
    });


    setCurrentTurn(currentTurn === 'x' ? 'o' : 'x');
  };

  const getWinner = (currentMap) => {
    // check rows
    for (let i = 0; i < 3; i++) {
      const isRowXwinning = currentMap[i].every(cell => cell == 'x')
      const isRowOwinning = currentMap[i].every(cell => cell == 'o')

      if (isRowXwinning) {
        return "x"
      }
      if (isRowOwinning) {
        return "o"
      }
    }

    // check columns
    for (let col = 0; col < 3; col++) {
      let isColumnXWinner = true;
      let isColumnOWinner = true;

      for (let row = 0; row < 3; row++) {
        if (currentMap[row][col] != 'x') {
          isColumnXWinner = false;
        }
        if (currentMap[row][col] != 'o') {
          isColumnOWinner = false;
        }
      }

      if (isColumnXWinner) {
        return "x"
      }
      if (isColumnOWinner) {
        return "o"
      }
    }

    // check diagonals
    let isDiagnoal1OWinning = true;
    let isDiagnoal1XWinning = true;
    let isDiagnoal2OWinning = true;
    let isDiagnoal2XWinning = true;

    for (let i = 0; i < 3; i++) {
      if (currentMap[i][i] != 'o') {
        isDiagnoal1OWinning = false;
      }
      if (currentMap[i][i] != 'x') {
        isDiagnoal1XWinning = false;
      }
      if (currentMap[i][2 - i] != 'o') {
        isDiagnoal2OWinning = false;
      }
      if (currentMap[i][2 - i] != 'x') {
        isDiagnoal2XWinning = false;
      }
    }

    if (isDiagnoal1XWinning || isDiagnoal2XWinning) {
      return "x"
    }
    if (isDiagnoal1OWinning || isDiagnoal2OWinning) {
      return "o"
    }

    // check tie
    if (!currentMap.some(row => row.some(cell => cell == ''))) {
      return "t";
    }
  }

  const nextPlayer = (player) => {
    return (player == 'x') ? 'o' : 'x';
  }

  const gameEnd = (player) => {
    if (player == 't') {
      Alert.alert(`It is a tie`, `今次打和啦！SUPER`, [
        {
          text: "Restart",
          onPress: resetGame,
        },
      ]);
    } else {
      Alert.alert(`Huraay`, `${(player == 'x') ? '貓寶寶' : 'Coffee'} won!`, [
        {
          text: "Restart",
          onPress: resetGame,
        },
      ]);
    }
  }

  const resetGame = () => {
    setMap(emptyMap);
  }

  const emptySquares = (currentMap) => {
    // collect all possible options
    let possiblePositions = [];

    currentMap.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === '') {
          possiblePositions.push({
            row: rowIndex,
            col: columnIndex,
          });
        }
      })
    })
    return possiblePositions;
  }

  const botTurn = () => {
    let possiblePositions = emptySquares(map);
    let chosenOption = possiblePositions[Math.floor(Math.random() * possiblePositions.length)];

    if (gameMode == 'MEDIUM') {
      // defend
      possiblePositions.forEach((cell) => {
        const tempMap = copyArray(map);
        tempMap[cell.row][cell.col] = 'x';

        if (getWinner(tempMap) == 'x') {
          chosenOption = cell;
        }
      });

      // attack
      possiblePositions.forEach((cell) => {
        const tempMap = copyArray(map);
        tempMap[cell.row][cell.col] = 'o';
        if (getWinner(tempMap) == 'o') {
          chosenOption = cell;
        }
      });
    } else if (gameMode == 'HARD') {
      chosenOption = minimax(map, 'o', 6).position;
    }

    onPress(chosenOption.row, chosenOption.col);
  }

  const minimax = (board, player, cpu) => {
    if (getWinner(board) == 'x') {
      return { score: -1 * (cpu + 1)};
    } else if (getWinner(board) == 'o') {
      return { score: 1 * (cpu + 1)};
    } else if (getWinner(board) == 't') {
      return { score: 0 };
    }

    let moves = [];
    let possiblePositions = emptySquares(board);

    if (cpu == 0) {
      return { score: 0, position: possiblePositions[Math.floor(Math.random() * possiblePositions.length)] }
    }

    // attack
    possiblePositions.forEach((cell) => {
      const tempMap = copyArray(map);
      tempMap[cell.row][cell.col] = player;
      if (getWinner(tempMap) == player) {
        return {score: (player == 'x')? -1: 1, position: cell};
      }
    });

    // defend
    possiblePositions.forEach((cell) => {
      const tempMap = copyArray(map);
      const tempBoard = copyArray(map);
      tempMap[cell.row][cell.col] = nextPlayer(player);
      tempBoard[cell.row][cell.col] = player;
      if (getWinner(tempMap) == nextPlayer(player)) {
        return { score: minimax(tempBoard, nextPlayer(player), cpu - 1).score, position: cell};
      }
    });

    // otherwises
    possiblePositions.forEach((cell) => {
      const tempBoard = copyArray(board);
      tempBoard[cell.row][cell.col] = player;
      const tempScore = minimax(tempBoard, nextPlayer(player), cpu - 1).score;
      moves.push({ score: tempScore, position: cell });
    })

    let bestMove = { score: 1000 }
    if (player == 'o') {
      bestMove = { score: -1000 };
    }

    moves.forEach((move) => {
      if ((player == 'o' && move.score > bestMove.score) || (player == 'x' && move.score < bestMove.score)) {
        bestMove = move;
      }
    });

    return bestMove;
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={bg} style={styles.bg} resizeMode="contain">
        <Text style={
          {
            fontSize: 24,
            color: "black",
            position: "absolute",
            top: 150,
          }}>
          Current Turn: {(currentTurn == 'x') ? '貓寶寶' : 'Coffee'}
        </Text>
        <View style={styles.map}>
          {map.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((cell, columnIndex) => (
                <Cell
                  key={`row-${rowIndex}-col-${columnIndex}`}
                  cell={cell}
                  onPress={() => onPress(rowIndex, columnIndex)}
                />
              ))}
            </View>
          ))}
        </View>
        <View style={styles.buttons}>
          <Text
            onPress={() => setGameMode("LOCAL")}
            style={[
              styles.button,
              { backgroundColor: gameMode === "LOCAL" ? "#9999CC" : "#CCCCCC" },
            ]}
          >
            Local
          </Text>
          <Text
            onPress={() => setGameMode("EASY")}
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === "EASY" ? "#9999CC" : "#CCCCCC",
              },
            ]}
          >
            Easy
          </Text>
          <Text
            onPress={() => setGameMode("MEDIUM")}
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === "MEDIUM" ? "#9999CC" : "#CCCCCC",
              },
            ]}
          >
            Medium
          </Text>
          <Text
            onPress={() => setGameMode("HARD")}
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === "HARD" ? "#9999CC" : "#CCCCCC",
              },
            ]}
          >
            Hard
          </Text>
        </View>

      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffdca',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg: {
    width: "100%",
    height: "103%",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "90%",
    aspectRatio: 1.1,
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  buttons: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
  },
  button: {
    color: "black",
    margin: 10,
    fontSize: 16,
    padding: 10,
    paddingHorizontal: 15,
  },
});
