import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Alert, StatusBar, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import * as S from './styles';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Button } from '../../components/Button';
import { RFValue } from 'react-native-responsive-fontsize';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { CarDTO } from '../../dtos/CarDTO';
import { Accessory } from '../../components/Acessory';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { format } from 'date-fns';
import { getPlatformDate } from '../../utils/getPlataformDate';
import { api } from '../../services/api';

interface Params {
    car: CarDTO,
    dates: string[],
}

interface RentalPeriod {
    start: string;
    end: string;
}


export function SchedulingDetails() {
    const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);
    const [loading, setLoading] = useState(false);

    const navigation: NavigationProp<any> = useNavigation();
    const theme = useTheme();
    const route = useRoute();
    const { car, dates } = route.params as Params;

    const rentTotal = Number(dates.length * car.rent.price);

    async function handleConfirmation() {
        setLoading(true);

        const schedulesByCar = await api.get(`/schedules_bycars/${car.id}`);

        const unavailable_dates = [
            ...schedulesByCar.data.unavailable_dates,
            ...dates
        ];

        await api.post(`/schedules_byuser`, {
            user_id: 1,
            car,
            startDate: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
            endDate: format(getPlatformDate(new Date(dates[dates.length - 1])), 'dd/MM/yyyy')
        });

        await api.put(`schedules_bycars/${car.id}`, {
            id: car.id,
            unavailable_dates
        }).then(() => {
            navigation.navigate('Confirmation', {
                nextScreenRoute: 'Home',
                title: 'Carro alugado!',
                message: `Agora você só precisa ir\naté a concessionária da RENTX\npegar o seu automóvel.`
            })
        }).catch(() => {
            setLoading(false);
            Alert.alert('Ocorreu um erro!');
        })


    }

    useEffect(() => {
        setRentalPeriod({
            start: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
            end: format(getPlatformDate(new Date(dates[dates.length - 1])), 'dd/MM/yyyy')
        });
    }, []);


    return (
        <S.Container>
            <StatusBar
                barStyle="dark-content"
                translucent
                backgroundColor="transparent"
            />

            <S.Header>
                <BackButton onPress={() => navigation.goBack()} />
            </S.Header>

            <S.CarImages>
                <ImageSlider imagesUrl={car.photos} />
            </S.CarImages>

            <S.Details>
                <S.Description>
                    <S.Brand>{car.brand}</S.Brand>
                    <S.Name>{car.name}</S.Name>
                </S.Description>
                <S.Rent>
                    <S.Period>{car.rent.period}</S.Period>
                    <S.Price>R${car.rent.price}</S.Price>
                </S.Rent>
            </S.Details>

            <S.Accessories>
                {car.accessories.map(accessory => (
                    <Accessory
                        key={accessory.type}
                        name={accessory.name}
                        icon={getAccessoryIcon(accessory.type)}
                    />
                ))}
            </S.Accessories>

            <S.RentalPeriod>
                <S.CalendarIcon>
                    <Feather
                        name="calendar"
                        size={RFValue(24)}
                        color={theme.colors.shape}
                    />
                </S.CalendarIcon>

                <S.DateInfo>
                    <S.DateTitle>DE</S.DateTitle>
                    <S.DateValue>{rentalPeriod.start}</S.DateValue>
                </S.DateInfo>

                <Feather
                    name="chevron-right"
                    size={RFValue(10)}
                    color={theme.colors.text}
                />

                <S.DateInfo>
                    <S.DateTitle>ATÉ</S.DateTitle>
                    <S.DateValue>{rentalPeriod.end}</S.DateValue>
                </S.DateInfo>
            </S.RentalPeriod>

            <S.RentalPrice>
                <S.RentalPriceLabel>TOTAL</S.RentalPriceLabel>
                <S.RentalPriceDetails>
                    <S.RentalPriceQuota>{`R$ ${car.rent.price} x ${dates.length} diárias.`}</S.RentalPriceQuota>
                    <S.RentalPriceTotal>R$ {rentTotal}</S.RentalPriceTotal>
                </S.RentalPriceDetails>
            </S.RentalPrice>
            <S.Footer>
                <Button title="Alugar agora" color={theme.colors.success} onPress={handleConfirmation} enabled={!loading} loading={loading} />
            </S.Footer>
        </S.Container>

    )
}


