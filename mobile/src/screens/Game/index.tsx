import { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GameParams } from '../../@types/navigation'

import logoImg from '../../assets/logo-nlw-esports.png'
import { Background } from '../../components/Background'

import { Entypo } from '@expo/vector-icons'

import { styles } from './styles'
import { THEME } from '../../theme'
import { Heading } from '../../components/Heading'
import { DuoCardProps, DuoCard } from '../../components/DuoCard'
import { DuoMatch } from '../../components/DuoMatch'

export function Game() {
  const [duos, setDuos] = useState<DuoCardProps[]>([])
  const [discordDuoSelected, setDiscordDuoSelected] = useState('')
  const navigation = useNavigation()
  const route = useRoute()
  const game = route.params as GameParams

  function handleGoBack() {
    navigation.goBack()
  }

  async function getDiscordUser(adsId: string) {
    fetch(`http://172.24.24.3:3333/ads/${adsId}/discord`)
      .then((response) => response.json())
      .then((data) => setDiscordDuoSelected(data.discord))
  }

  useEffect(() => {
    fetch(`http://172.24.24.3:3333/games/${game.id}/ads`)
      .then((response) => response.json())
      .then((data) => setDuos(data))
  }, [])

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo
              size={20}
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
            />
          </TouchableOpacity>
          <Image source={logoImg} alt="logo" style={styles.logo} />

          <View style={styles.right} />
        </View>

        <Image
          resizeMode="cover"
          source={{ uri: game.bannerUrl }}
          style={styles.cover}
          alt=""
        />

        <Heading title={game.title} subtitle="Conecte-se e comece a jogar!" />

        <FlatList
          style={styles.containerList}
          contentContainerStyle={[
            duos.length > 0 ? styles.contentList : styles.emptyLintContainer,
          ]}
          data={duos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DuoCard
              data={item}
              onConnect={() => {
                getDiscordUser(item.id)
              }}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Não há anúncios publicados ainda!
            </Text>
          )}
        />

        <DuoMatch
          visible={discordDuoSelected.length > 0}
          discord={discordDuoSelected}
          onClose={() => {
            setDiscordDuoSelected('')
          }}
        />
      </SafeAreaView>
    </Background>
  )
}
