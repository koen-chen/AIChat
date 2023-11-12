/* eslint-disable react/prop-types */
import { Slider, Text, TextInput, Drawer } from '@mantine/core'
import { serviceNameAtom, temperatureAtom } from '@/stores'
import { useAtom } from 'jotai'

export default function Settings({ openSettings, handleCloseSettings }) {
  const [serviceName, setServiceName] = useAtom(serviceNameAtom)
  const [temperature, setTemperature] = useAtom(temperatureAtom)

  return (
    <Drawer
      position="right"
      opened={openSettings}
      onClose={handleCloseSettings}
      title="设置智能系统"
    >
      <div className="py-10">
        <div className="mb-10">
          <Text size="sm" className="mb-2">修改智能系统名称</Text>
          <TextInput value={serviceName} onChange={(event) => setServiceName(event.currentTarget.value)} />
        </div>

        <div className='mb-10'>
          <Text size="sm" className="mb-2">回答多样性 (数值越大，多样性越高)</Text>
          <Slider
            value={temperature}
            onChange={setTemperature}
            color="blue"
            min={0}
            max={1}
            step={0.1}
          />
        </div>
      </div>
    </Drawer>
  )
}