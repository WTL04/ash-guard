import React, {useState} from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

export default function ChecklistScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
     <Text style={styles.title}>Checklist</Text>
      <View style={styles.content}>

        <Pressable style={styles.addItemButton}>      
          <Ionicons name="add-circle" size={70} color={Colors.primary} />
        </Pressable>
        <Pressable style={styles.addRecommendations}>
            <Ionicons name="bulb" size={35} color="white" />
        </Pressable>

       </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 12,
  },

addItemButton: {
    position: 'absolute',     
    bottom: 20,               
    right: 20,                
    width: 70,                
    height: 70,
    borderRadius: 35,       
    justifyContent: 'center', 
    alignItems: 'center',     
},

addRecommendations: {
    position: 'absolute',
    bottom: 22,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: Colors.primary, 
    justifyContent: 'center',
    alignItems: 'center',
}
});