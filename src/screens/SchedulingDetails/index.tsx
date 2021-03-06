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
import { useNetInfo } from '@react-native-community/netinfo';

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
    const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);

    const navigation: NavigationProp<any> = useNavigation();
    const theme = useTheme();
    const route = useRoute();
    const netInfo = useNetInfo();
    const { car, dates } = route.params as Params;

    const rentTotal = Number(dates.length * car.price);

    async function handleConfirmation() {
        setLoading(true);

        await api.post(`/rentals`, {
            user_id: 1,
            car_id: car.id,
            start_date: new Date(dates[0]),
            end_date: new Date(dates[dates.length - 1]),
            total: rentTotal
        }).then(() => {
            navigation.navigate('Confirmation', {
                nextScreenRoute: 'Home',
                title: 'Carro alugado!',
                message: `Agora voc?? s?? precisa ir\nat?? a concession??ria da RENTX\npegar o seu autom??vel.`
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

    useEffect(() => {
        async function fetchCarUpdate() {
            const response = await api.get(`/cars/${car.id}`);
            setCarUpdated(response.data);
        }
        if (netInfo.isConnected === true) {
            fetchCarUpdate();
        }
    }, [netInfo.isConnected])

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
                <ImageSlider imagesUrl={!!carUpdated.photos ? carUpdated.photos : [{ id: car.thumbnail, photo: car.thumbnail }]} />
            </S.CarImages>

            <S.Details>
                <S.Description>
                    <S.Brand>{car.brand}</S.Brand>
                    <S.Name>{car.name}</S.Name>
                </S.Description>
                <S.Rent>
                    <S.Period>{car.period}</S.Period>
                    <S.Price>R${car.price}</S.Price>
                </S.Rent>
            </S.Details>

            {carUpdated.accessories &&
                <S.Accessories>
                    {carUpdated.accessories.map(accessory => (
                        <Accessory
                            key={accessory.type}
                            name={accessory.name}
                            icon={getAccessoryIcon(accessory.type)}
                        />
                    ))}
                </S.Accessories>
            }


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
                    <S.DateTitle>AT??</S.DateTitle>
                    <S.DateValue>{rentalPeriod.end}</S.DateValue>
                </S.DateInfo>
            </S.RentalPeriod>

            <S.RentalPrice>
                <S.RentalPriceLabel>TOTAL</S.RentalPriceLabel>
                <S.RentalPriceDetails>
                    <S.RentalPriceQuota>{`R$ ${car.price} x ${dates.length} di??rias.`}</S.RentalPriceQuota>
                    <S.RentalPriceTotal>R$ {rentTotal}</S.RentalPriceTotal>
                </S.RentalPriceDetails>
            </S.RentalPrice>
            <S.Footer>
                <Button title="Alugar agora" color={theme.colors.success} onPress={handleConfirmation} enabled={!loading} loading={loading} />
            </S.Footer>
        </S.Container>

    )
}


