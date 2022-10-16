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
  const [gameMode, setGameMode] = useState("LOCAL"); // LOCAL, BOT_EASY, BOT_MEDIUM;

  useEffect(() => {
    if (currentTurn == 'o' && gameMode !== "LOCAL") {
      botTurn();
    }
  }, [currentTurn, gameMode]);

  useEffect(() => {
    const winner = getWinner(map);
    if (winner) {
      gameWon(winner);
    } else {
      checkTieState();    
    }
  }, [map]);

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
  
  const getWinner = () => {
    // check rows
    for (let i = 0; i < 3; i++) {
      const isRowXwinning = map[i].every(cell => cell == 'x')
      const isRowOwinning = map[i].every(cell => cell == 'o')

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
        if (map[row][col] != 'x') {
          isColumnXWinner = false;
        }
        if (map[row][col] != 'o') {
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
      if (map[i][i] != 'o') {
        isDiagnoal1OWinning = false;
      }
      if (map[i][i] != 'x') {
        isDiagnoal1XWinning = false;
      }
      if (map[i][2 - i] != 'o') {
        isDiagnoal2OWinning = false;
      }
      if (map[i][2 - i] != 'x') {
        isDiagnoal2XWinning = false;
      }
    }
    
    if (isDiagnoal1XWinning || isDiagnoal2XWinning) {
      return "x"
    }
    if (isDiagnoal1OWinning || isDiagnoal2OWinning) {
      return "o"
    }
  }
  
  const checkTieState = () => {
    if (!map.some(row => row.some(cell => cell == ''))) {
      Alert.alert(`It is a tie!`, `tie`, [
        {
          text: "Restart",
          onPress: resetGame,
        },
      ]);
    }
  }
  
  const gameWon = (player) => {
    Alert.alert(`Huraay`, `Player ${player} won!`, [
      {
        text: "Restart",
        onPress: resetGame,
      },
    ]);
  };

  const resetGame = () => {
    setMap(emptyMap);
    setCurrentTurn('x');
  }

  const botTurn = () => {
    // collect all possible options
    let possiblePositions = [];

    map.forEach((row,rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === ''){
          possiblePositions.push({
            row: rowIndex,
            col: columnIndex,
          });
        }
      })
    })

    // Defend
    let chosenOption = possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
    onPress(chosenOption.row, chosenOption.col);
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
            Current Turn: {currentTurn.toUpperCase()}
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
              { backgroundColor: gameMode === "LOCAL" ? "#9999FF" : "#FFFFFF" },
            ]}
          >
            Local
          </Text>
          <Text
            onPress={() => setGameMode("BOT_EASY")}
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === "BOT_EASY" ? "#9999FF" : "#FFFFFF",
              },
            ]}
          >
            Easy Bot
          </Text>
          <Text
            onPress={() => setGameMode("BOT_MEDIUM")}
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === "BOT_MEDIUM" ? "#9999FF" : "#FFFFFF",
              },
            ]}
          >
            Medium Bot
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
    backgroundColor: '#fff',
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
