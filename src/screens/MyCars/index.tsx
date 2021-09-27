import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList } from 'react-native';
import { useTheme } from 'styled-components';
import { useNavigation, useIsFocused } from '@react-navigation/core';
import { AntDesign } from '@expo/vector-icons';

import { BackButton } from '../../components/BackButton';

import { Car } from '../../components/Car';
import { Car as ModelCar } from '../../database/model/Car';
import { api } from '../../services/api';

import * as S from './styles';
import { LoadAnimation } from '../../components/LoadAnimation';
import { format, parseISO } from 'date-fns';

interface DataProps {
    id: string;
    car: ModelCar;
    start_date: string;
    end_date: string;

}

export function MyCars() {
    const [cars, setCars] = useState<DataProps[]>([]);
    const [loading, setLoading] = useState(true);
    const screenIsFocus = useIsFocused();

    const navigation = useNavigation();
    const theme = useTheme();

    function handleBack() {
        navigation.goBack();
    }

    useEffect(() => {
        async function fetchCars() {
            try {
                const response = await api.get('/rentals');
                const dataFormmated = response.data.map((data: DataProps) => {
                    return {
                        id: data.id,
                        car: data.car,
                        start_date: format(parseISO(data.start_date), 'dd/MM/yyyy'),
                        end_date: format(parseISO(data.end_date), 'dd/MM/yyyy'),
                    }
                })
                setCars(dataFormmated);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchCars();
    }, [screenIsFocus]);

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

            {loading ? <LoadAnimation /> : (
                <S.Content>
                    <S.Appointments>
                        <S.AppointmentsTitle>Agendamentos feitos</S.AppointmentsTitle>
                        <S.AppointmentsQuantity>{cars.length}</S.AppointmentsQuantity>
                    </S.Appointments>

                    <FlatList
                        data={cars}
                        keyExtractor={item => String(item.id)}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <S.CarWrapper>
                                <Car data={item.car} />
                                <S.CarFooter>
                                    <S.CarFooterTitle>Período</S.CarFooterTitle>
                                    <S.CarFooterPeriod>
                                        <S.CarFooterDate>{item.start_date}</S.CarFooterDate>
                                        <AntDesign name="arrowright" size={20} color={theme.colors.title} style={{ marginHorizontal: 10 }} />
                                        <S.CarFooterDate>{item.end_date}</S.CarFooterDate>
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