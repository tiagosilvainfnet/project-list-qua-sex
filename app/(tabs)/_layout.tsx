import {Redirect, Tabs} from 'expo-router';
import React from 'react';
import { TabBarIcon } from "@/components";
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {useSession} from "@/app/ctx";
import {Text} from "react-native";

export default function TabLayout() {
    const { session, isLoading } = useSession();

    if(isLoading){
        return <Text>Carregando...</Text>
    }

    if(!session){
        return <Redirect href="/login" />
    }

  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
        <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
              ),
            }}
        />
        <Tabs.Screen
            name="dashboard"
            options={{
                title: 'Dashboard',
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'analytics' : 'analytics-outline'} color={color} />
                ),
            }}
        />
        <Tabs.Screen
            name="profile"
            options={{
                title: 'Profile',
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
                ),
            }}
        />
    </Tabs>
  );
}
