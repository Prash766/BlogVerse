import {atom} from 'recoil'
import { SignupType } from '@prash766/common-app'

export const userInfo = atom<any>({
    key:"UserInfoAtom",
    default:{}

})
