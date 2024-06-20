import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import rpgData from './dataRPG.json'; // Importando o JSON local

const App = () => {
  const [rpgTitle, setRpgTitle] = useState("");
  const [rpgDataState, setRpgDataState] = useState(null);
  const [location, setLocation] = useState(null);
  const [playersNearby, setPlayersNearby] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
      findNearbyPlayers(locationData); // Simulando a busca de jogadores próximos
    })();
  }, []);

  const handleSearch = () => {
    if (rpgTitle.trim() === "") {
      Alert.alert('Aviso', 'Por favor, insira um título de RPG válido.');
      return;
    }

    // Procurar o RPG correspondente na lista
    const foundRpg = rpgData.find(rpg => rpg.nome.toLowerCase() === rpgTitle.toLowerCase());

    if (foundRpg) {
      setRpgDataState(foundRpg);
    } else {
      Alert.alert('Erro', 'RPG não encontrado. Verifique o título e tente novamente.');
    }
  };

  // Função simulada para encontrar jogadores próximos
  const findNearbyPlayers = (locationData) => {
    // Aqui você poderia implementar a lógica real para buscar jogadores próximos
    // No entanto, vamos apenas simular com dados estáticos por enquanto
    const nearbyPlayers = [
      { id: 1, name: 'Jogador 1', distance: '2 km', coords: { latitude: locationData.coords.latitude + 0.01, longitude: locationData.coords.longitude + 0.01 } },
      { id: 2, name: 'Jogador 2', distance: '5 km', coords: { latitude: locationData.coords.latitude - 0.01, longitude: locationData.coords.longitude - 0.01 } },
    ];
    setPlayersNearby(nearbyPlayers);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 20 }}>
        Busca de RPGs
      </Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        placeholder="Digite o nome do RPG"
        value={rpgTitle}
        onChangeText={(text) => setRpgTitle(text)}
      />
      <Button title="Buscar RPG" onPress={handleSearch} />
      {rpgDataState && (
        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{rpgDataState.nome}</Text>
          <Text>Edição: {rpgDataState.edição}</Text>
          <Text>Ano: {rpgDataState.ano}</Text>
        </View>
      )}
      {location && (
        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontSize: 16 }}>Sua localização atual:</Text>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
        </View>
      )}
      {location && (
        <MapView
          style={{ width: '100%', height: 200, marginVertical: 20 }}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Sua Localização"
          />
          {playersNearby.map((player) => (
            <Marker
              key={player.id}
              coordinate={player.coords}
              title={player.name}
              description={`Distância: ${player.distance}`}
            />
          ))}
        </MapView>
      )}
      {playersNearby.length > 0 && (
        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Jogadores próximos:</Text>
          {playersNearby.map((player) => (
            <Text key={player.id}>{player.name} - {player.distance}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

export default App;
