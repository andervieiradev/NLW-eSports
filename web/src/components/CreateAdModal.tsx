import { FormEvent, useEffect, useState } from 'react'
import { Check, GameController } from 'phosphor-react'
import { Input } from './Form/Input'
import * as Dialog from '@radix-ui/react-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { Game } from '../App'

import axios from 'axios'

export function CreateAdModal() {
  const [games, setGames] = useState<Game[]>([])
  const [weekDays, setWeekDays] = useState<string[]>([])
  const [useVoiceChannel, setUseVoiceChannel] = useState(false)

  useEffect(() => {
    axios('http://localhost:3333/games').then((response) => {
      setGames(response.data)
    })
  }, [])

  async function handleCreateAd(event: FormEvent) {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)
    const data = Object.fromEntries(formData)

    // validação
    if (!data.name) {
      return
    }

    try {
      await axios.post(`http://localhost:3333/games/${data.game}/ads`, {
        name: data.name,
        yearsPlaying: Number(data.yearsPlaying),
        discord: data.discord,
        weekDays: weekDays.map(Number),
        hourStart: data.hourStart,
        hourEnd: data.hourEnd,
        useVoiceChannel,
      })

      alert('Anúncio criado com sucesso!')
    } catch (error) {
      console.log(error)
      alert('Erro ao criar anúncio!')
    }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.Content className="rounded-lg shadow-lg shadow-black/25 w-[480px] fixed bg-[#2a2634] pt-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Dialog.Title className="text-3xl font-black">
          Publique um anúncio
        </Dialog.Title>

        <form onSubmit={handleCreateAd} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="game"
              className="text-base text-white font-semibold"
            >
              Qual o game?
            </label>
            <select
              id="game"
              name="game"
              className="bg-zinc-900 py-3 px-4 appearance-none rounded text-sm placeholder:text-zinc-500"
            >
              <option disabled value="">
                Selecione o game que desejar jogar
              </option>

              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name">Seu nome (ou nickname)</label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Como te chamam dentro do game?"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="yearsPlaying">Joga há quantos anos?</label>
              <Input
                id="yearsPlaying"
                name="yearsPlaying"
                type="number"
                placeholder="Tudo bem ser ZERO"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="discord">Qual seu Discord?</label>
              <Input
                id="discord"
                name="discord"
                type="text"
                placeholder="Usuario#0000"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="weekDays">Quando costume jogar?</label>

              <ToggleGroup.Root
                type="multiple"
                className="grid grid-cols-4 gap-1"
                onValueChange={setWeekDays}
                value={weekDays}
              >
                <ToggleGroup.Item
                  className={`w-10 h-10 rounded 
                  ${weekDays.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                  title="Domingo"
                  value="0"
                >
                  D
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  className={`w-10 h-10 rounded 
                  ${weekDays.includes('1') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                  title="Segunda"
                  value="1"
                >
                  S
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  className={`w-10 h-10 rounded 
                  ${weekDays.includes('2') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                  title="Terça"
                  value="2"
                >
                  T
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  className={`w-10 h-10 rounded 
                  ${weekDays.includes('3') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                  title="Quarta"
                  value="3"
                >
                  Q
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  className={`w-10 h-10 rounded 
                  ${weekDays.includes('4') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                  title="Quinta"
                  value="4"
                >
                  Q
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  className={`w-10 h-10 rounded 
                  ${weekDays.includes('5') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                  title="Sexta"
                  value="5"
                >
                  S
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  className={`w-10 h-10 rounded 
                  ${weekDays.includes('6') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                  title="Sábado"
                  value="6"
                >
                  S
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="hourStart">Quando horário do dia?</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="time"
                  name="hourStart"
                  id="hourStart"
                  placeholder="De"
                />
                <Input
                  type="time"
                  name="hourEnd"
                  id="hourEnd"
                  placeholder="Até"
                />
              </div>
            </div>
          </div>

          <label className="cursor-pointer mt-2 flex items-center gap-2 text-sm">
            <Checkbox.Root
              className="w-6 h-6 rounded p-1 bg-zinc-900"
              checked={useVoiceChannel}
              onCheckedChange={(checked) => {
                if (checked === true) {
                  setUseVoiceChannel(true)
                } else {
                  setUseVoiceChannel(false)
                }
              }}
            >
              <Checkbox.Indicator>
                <Check size={16} className="h-4 w-4 text-emerald-400" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            Costumo me conectar ao chat de voz
          </label>

          <footer className="mt-4 flex justify-end gap-4">
            <Dialog.Close className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600">
              Cancelar
            </Dialog.Close>
            <button
              className="bg-violet-500 flex items-center gap-3 px-5 h-12 rounded-md font-semibold hover:bg-violet-600"
              type="submit"
            >
              <GameController size={24} />
              Encontrar duo
            </button>
          </footer>
        </form>

        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Portal>
  )
}
