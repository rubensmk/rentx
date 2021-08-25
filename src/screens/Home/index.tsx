import React, { useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import * as S from './styles'

import Logo from '../../assets/logo.svg'
import { RFValue } from 'react-native-responsive-fontsize'
import { Car } from '../../components/Car'
import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { api } from '../../services/api'
import { CarDTO } from '../../dtos/CarDTO'
import { Load } from '../../components/Load'
import { useTheme } from 'styled-components'

export function Home() {
    const navigation: NavigationProp<any> = useNavigation();
    const [cars, setCars] = useState<CarDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();


    function handleCarDetails(car: CarDTO) {
        navigation.navigate('CarDetails', { car })
    }

    function handleOpenMyCars() {
        navigation.navigate('MyCars')
    }

    useEffect(() => {
        async function fetchCars() {

            try {
                const response = await api.get('/cars');
                setCars(response.data);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchCars();
    }, [])
    return (
        <S.Container>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <S.Header>
                <S.HeaderContent>
                    <Logo width={RFValue(108)} height={RFValue(12)} />
                    <S.TotalCars>
                        Total de 12 carros
                    </S.TotalCars>
                </S.HeaderContent>
            </S.Header>

            {loading ? <Load /> : (
                <S.CarList
                    data={cars}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) => <Car data={item} onPress={() => handleCarDetails(item)} />}
                />
            )}

            <S.MyCarsButton onPress={handleOpenMyCars}>
                <Ionicons name="ios-car-sport" size={32} color={theme.colors.background_secondary} />
            </S.MyCarsButton>

        </S.Container>
    )
}
