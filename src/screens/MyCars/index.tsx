import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList } from 'react-native';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/core';
import { AntDesign } from '@expo/vector-icons';
import { parseISO, format } from 'date-fns';

import { BackButton } from '../../components/BackButton';

import { Car } from '../../components/Car';
import { CarDTO } from '../../dtos/CarDTO';
import { api } from '../../services/api';

import * as S from './styles';
import { Load } from '../../components/Load';

interface CarProps {
    id: string;
    user_id: string;
    car: CarDTO;
    startDate: string;
    endDate: string;

}

export function MyCars() {
    const [cars, setCars] = useState<CarProps[]>([]);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();
    const theme = useTheme();

    function handleBack() {
        navigation.goBack();
    }

    useEffect(() => {
        async function fetchCars() {
            try {
                const response = await api.get('/schedules_byuser?user_id=1');
                console.log(response.data)
                setCars(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchCars();
    }, []);

    return (
        <S.Container>
            <S.Header>
                <StatusBar
                    barStyle="light-content"
                    translucent
                    backgroundColor="transparent"
                />
                <BackButton
                    onPress={handleBack}
                    color={theme.colors.shape}
                />

                <S.Title>
                    Seus agendamentos estão aqui
                </S.Title>

                <S.SubTitle>
                    Conforto, segurança e praticidade.
                </S.SubTitle>
            </S.Header>

            {loading ? <Load /> : (
                <S.Content>
                    <S.Appointments>
                        <S.AppointmentsTitle>Agendamentos feitos</S.AppointmentsTitle>
                        <S.AppointmentsQuantity>{cars.length}</S.AppointmentsQuantity>
                    </S.Appointments>

                    <FlatList
                        data={cars}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <S.CarWrapper>
                                <Car data={item.car} />
                                <S.CarFooter>
                                    <S.CarFooterTitle>Período</S.CarFooterTitle>
                                    <S.CarFooterPeriod>
                                        <S.CarFooterDate>{item.startDate}</S.CarFooterDate>
                                        <AntDesign name="arrowright" size={20} color={theme.colors.title} style={{ marginHorizontal: 10 }} />
                                        <S.CarFooterDate>{item.endDate}</S.CarFooterDate>
                                    </S.CarFooterPeriod>
                                </S.CarFooter>
                            </S.CarWrapper>

                        )}
                    />
                </S.Content>
            )}
        </S.Container>
    );
}