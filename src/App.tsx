import * as React from "react"
import './css/animation.css'
import { useState, useEffect } from 'react'
import { TiDeleteOutline } from 'react-icons/ti'
import { EventEmitter } from 'events'
import { FaPlus } from 'react-icons/fa'
import { GiBroadDagger, GiStarShuriken } from 'react-icons/gi'
import { v4 as uuidv4 } from 'uuid';
import {
  useColorModeValue,
  ChakraProvider,
  Box,
  Text,
  VStack,
  Grid,
  theme,
  Heading,
  Spacer,
  OrderedList,
  ListItem,
  Checkbox,
  HStack,
  IconButton,
  Button,
  Tooltip,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Icon,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { motion } from "framer-motion"
const animator = new EventEmitter()
export function App() {
  const [animelist, setanimelist] = useState(
    [
      {
        id: uuidv4(),
        name: "Monogatari",
        completed: false,
      },
      {
        id: uuidv4(),
        name: "Fruit basket",
        completed: false,
      },
      {
        id: uuidv4(),
        name: "Great teacher Onizuka",
        completed: false,
      },
      {
        id: uuidv4(),
        name: "The time I got reincarnated as a slime",
        completed: false,
      }
    ]
  );
  useEffect(() => {
    animator.on("anime_delete", (animeID) => {
      setanimelist((list) =>
        list.filter((anime) => anime.id !== animeID)
      )
    });
    animator.on("anime_add", (animeName) => {
      setanimelist(list => list.concat({ id: uuidv4(), name: animeName, completed: false }))
    });
    animator.on("anime_status_change", (data) => {
      setanimelist((list) => {
        let updatedList = list.map((anime) => {
          if (anime.id === data.id) {
            return { id: anime.id, name: anime.name, completed: data.newStatus };
          }
          return anime;
        })
        return updatedList;
      });
    })
  }, []);

  useEffect(() => {
    console.log(animelist)
  }, [animelist])
  const [time, setTime] = useState('0ms');
  const [value, setValue] = useState('');
  let handleValueChange = (e: any) => {
    let inputValue = e.target.value
    setValue(inputValue)
  }
  let submit = (e: any) => {
    e.preventDefault();
    animator.emit('anime_add', value);
  }
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={6} width="100%">
          <HStack width="100%" paddingTop={2}>
            <Spacer />
            <Spacer />
            {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
          </HStack>
          <Heading as="h2" size="2xl">
            My Anime List
            </Heading>
          <HStack width='300px'>
            <Spacer />
            <form style={{
              width: '100%'
            }} onSubmit={submit}>
              <InputGroup
                onMouseEnter={() => { setTime('2000ms') }}
                onMouseLeave={() => { setTime('0ms') }}>

                <InputRightElement
                  pointerEvents="none"
                  style={{
                    animationName: 'spin',
                    animationDuration: time,
                    animationIterationCount: 'infinite',
                    animationTimingFunction: 'linear',
                  }}
                >

                  <GiStarShuriken />
                </InputRightElement >

                <Input type="tel" placeholder="Add Anime" value={value} onChange={handleValueChange} />

              </InputGroup>
            </form>

            {/* <Tooltip label="Add Anime" fontSize="md">
                <IconButton aria-label='adds its shit dumbumb' icon={<FaPlus />} />
              </Tooltip> */}
          </HStack>
          <OrderedList textAlign='left'>
            {animelist && animelist.map((anime) => <Anime checked={anime.completed} name={anime.name} key={anime.id} id={anime.id} />)}
          </OrderedList>
        </VStack>
      </Box>
    </ChakraProvider>
  )
}
function Anime(props: { name: string, checked: boolean, id: string }) {
  const [isHover, setIsHover] = useState(false);

  let change = () => {
    if (props.checked) {
      animator.emit("anime_status_change", { id: props.id, newStatus: false });
    } else {
      animator.emit("anime_status_change", { id: props.id, newStatus: true });
    }
  }

  let click = () => {
    animator.emit("anime_delete", props.id);
  }
  const color = useColorModeValue('red.500', 'red.400')
  return (
    <ListItem padding={1}>
      <HStack>
        <Text marginRight='50'>{props.name}</Text>
        <Spacer />
        <Checkbox
          size="lg"
          isChecked={props.checked}
          mt={1}
          colorScheme="green"
          onChange={change}
        >
        </Checkbox>
        <IconButton
          variant='unstyled'
          onClick={click}
          mt={1}
          color={color}
          aria-label="Delete item"
          isRound
          fontSize="30px"
          icon={<TiDeleteOutline />}
          _focus={{
            outline: "none"
          }} />
      </HStack>
    </ListItem>
  )
}


