import React, { useEffect, useState } from 'react'
import { StatusBar, StyleSheet } from 'react-native'
import * as S from './styles'

import Logo from '../../assets/logo.svg'
import { RFValue } from 'react-native-responsive-fontsize'
import { Car } from '../../components/Car'
import { Car as ModelCar } from '../../database/model/Car'
import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { api } from '../../services/api'
import { CarDTO } from '../../dtos/CarDTO'
import { LoadAnimation } from '../../components/LoadAnimation'
import { useTheme } from 'styled-components'
import { useNetInfo } from '@react-native-community/netinfo'
import { synchronize } from '@nozbe/watermelondb/sync'
import { database } from '../../database'

import Animated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, withSpring } from 'react-native-reanimated';
import { RectButton, PanGestureHandler } from 'react-native-gesture-handler'

const ButtonAnimated = Animated.createAnimatedComponent(RectButton);

export function Home() {
    const navigation: NavigationProp<any> = useNavigation();
    const theme = useTheme();
    const netInfo = useNetInfo();

    const [cars, setCars] = useState<ModelCar[]>([]);
    const [loading, setLoading] = useState(false);

    const positionY = useSharedValue(0);
    const positionX = useSharedValue(0);

    const myCarsButtonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: positionX.value }, { translateY: positionY.value }]
        }
    });

    const onGestureEvent = useAnimatedGestureHandler({
        onStart(_, ctx: any) {
            ctx.positionX = positionX.value;
            ctx.positionY = positionX.value;
        },
        onActive(event, ctx: any) {
            positionX.value = ctx.positionX + event.translationX;
            positionY.value = ctx.positionY + event.translationY;
        },
        onEnd() {
            positionX.value = withSpring(0);
            positionY.value = withSpring(0);
        }
    })

    function handleCarDetails(car: CarDTO) {
        navigation.navigate('CarDetails', { car })
    }

    async function offlineSyncronize() {
        await synchronize({
            database,
            pullChanges: async ({ lastPulledAt }) => {
                const response = await api.get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`);
                const { changes, latestVersion } = response.data;
                console.log(changes);

                return { changes, timestamp: latestVersion };
            },
            pushChanges: async ({ changes }) => {
                const user = changes.users;
                await api.post('/users/sync', user);
            }
        })
    }
    // function handleOpenMyCars() {
    //     navigation.navigate('MyCars')
    // }

    useEffect(() => {
        let isMounted = true;
        async function fetchCars() {

            try {
                const carCollection = database.get<ModelCar>('cars');
                const cars = await carCollection.query().fetch();
                if (isMounted) {
                    setCars(cars);
                }
            } catch (error) {
                throw new Error(error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }
        fetchCars();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (netInfo.isConnected === true) {
            offlineSyncronize();
        }
    }, [netInfo.isConnected])
    return (
        <S.Container>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <S.Header>
                <S.HeaderContent>
                    <Logo width={RFValue(108)} height={RFValue(12)} />
                    {!loading && (
                        <S.TotalCars>
                            Total de {cars.length} carros
                        </S.TotalCars>
                    )}
                </S.HeaderContent>
            </S.Header>

            {loading ? <LoadAnimation /> :
                <S.CarList
                    data={cars}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) => <Car data={item} onPress={() => handleCarDetails(item)} />}
                />
            }

            {/* <PanGestureHandler onGestureEvent={onGestureEvent}>
                <Animated.View style={[myCarsButtonStyle, { position: 'absolute', bottom: 13, right: 22 }]}>
                    <ButtonAnimated onPress={handleOpenMyCars} style={[styles.button, { backgroundColor: theme.colors.main }]}>
                        <Ionicons name="ios-car-sport" size={32} color={theme.colors.background_secondary} />
                    </ButtonAnimated>
                </Animated.View>
            </PanGestureHandler> */}

        </S.Container>
    )
}

