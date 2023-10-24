import { Slider, Text, Textarea, TextInput, Drawer } from '@mantine/core'
import { serviceNameAtom, temperatureAtom, filterWordsAtom } from '@/stores'
import { useAtom } from 'jotai'

export default function Settings({ openSettings, handleCloseSettings }) {
  const [serviceName, setServiceName] = useAtom(serviceNameAtom)
  const [temperature, setTemperature] = useAtom(temperatureAtom)
  const [filterWords, setFilterWords] = useAtom(filterWordsAtom)

  return (
    <Drawer
      position="right"
      opened={openSettings}
      onClose={handleCloseSettings}
      title="设置客服系统"
    >
      <div className="py-10">
        <div className="mb-10">
          <Text size="sm" className="mb-2">修改智能客服名称</Text>
          <TextInput value={serviceName} onChange={(event) => setServiceName(event.currentTarget.value)} />
        </div>

        <div className='mb-10'>
          <Text size="sm" className="mb-2">过滤关键词</Text>
          <Textarea
            description="多个过滤词用竖线 ‘｜’ 分隔，例如 (战争 | 自杀)"
            autosize
            minRows={2}
            value={filterWords}
            onChange={(event) => setFilterWords(event.currentTarget.value)}
          />
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