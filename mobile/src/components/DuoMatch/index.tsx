import { useState } from 'react'
import {
  ActivityIndicator,
  ActivityIndicatorComponent,
  Alert,
  Modal,
  ModalProps,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { MaterialIcons } from '@expo/vector-icons'

import { styles } from './styles'
import { THEME } from '../../theme'
import { CheckCircle, SelectionPlus } from 'phosphor-react-native'
import { Heading } from '../Heading'

interface Props extends ModalProps {
  discord: string
  onClose: () => void
}

export function DuoMatch({ onClose, discord, ...rest }: Props) {
  const [isCopping, setIsCopping] = useState(false)

  async function handleCopyDiscordToClipbord() {
    setIsCopping(true)

    await Clipboard.setStringAsync(discord)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    Alert.alert(
      'Discord Copiado!',
      'Usúario copiado para você colocar no Discord',
    )

    setIsCopping(false)
  }

  return (
    <Modal statusBarTranslucent transparent {...rest} animationType="fade">
      <View style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <MaterialIcons
              name="close"
              size={20}
              color={THEME.COLORS.CAPTION_500}
            />
          </TouchableOpacity>

          <CheckCircle size={64} color={THEME.COLORS.SUCCESS} weight="bold" />

          <Heading
            style={{ alignItems: 'center', marginTop: 24 }}
            title="Let's Play!"
            subtitle="Agora é só começar a jogar!"
          />

          <Text style={styles.label}>Adicione no Discord</Text>

          <TouchableOpacity
            style={styles.discordButton}
            onPress={handleCopyDiscordToClipbord}
            disabled={isCopping}
          >
            <Text style={styles.discord}>
              {isCopping ? (
                <ActivityIndicator color={THEME.COLORS.PRIMARY} />
              ) : (
                discord
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
