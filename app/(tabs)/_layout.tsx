import {Redirect, Tabs} from 'expo-router';
import React, {useEffect} from 'react';
import { TabBarIcon } from "@/components";
import {useSession} from "@/app/ctx";
import {Text} from "react-native";
import {useTheme} from "react-native-paper";
import {syncBothDatabase} from "@/services/database";

export default function TabLayout() {
    const { session, isLoading } = useSession();
    const theme = useTheme();

    if(isLoading){
        return <Text>Carregando...</Text>
    }

    if(!session){
        return <Redirect href="/login" />
    }else{
        syncBothDatabase(session);
    }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarStyle: {
            backgroundColor: theme.colors.background,
        },
        headerShown: false,
      }}>
        <Tabs.Screen
            name="index"
            options={{
                title: 'Form',
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                ),
            }}
        />
        <Tabs.Screen
            name="home"
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
