<script setup>
import { ref, onMounted } from 'vue'
import cashierEdit from './Cashier.vue'
import trash from './icon/Trash.vue'
import edit from './icon/Edit.vue'
import { getHistory } from '../composable/getHistory.js'

const historys = ref([])

onMounted(async () => {
    historys.value = await getHistory()
})

const deleteHistory = async (deleteId) => {
    try {
        const res = await fetch(`http://localhost:5000/history/${deleteId}`, {
            method: 'DELETE'
        })
        if (res.ok) {
            historys.value = historys.value.filter((his) => {
                return his.id !== deleteId
            })
        } 
        else throw new Error('Oops, sorry cannot delete')
    } 
    catch (error) {
        console.log(error)
    }
}

const currentComponant = ref('historyComponant')
const setCurrentComponant = (curComp) => {
    currentComponant.value = curComp
}

const editHis = ref(undefined)
const setEditMode = (hisEdit) => {
    editHis.value = hisEdit
    setCurrentComponant('CashierComponent')
}

const editHistory = async (updatedHistory) => {
    console.log(updatedHistory)
    try {
        const res = await fetch(`http://localhost:5000/history/${updatedHistory.id}`,
            {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    numList: updatedHistory.numList,
                    dateTime: updatedHistory.dateTime,
                    customer: updatedHistory.customer,
                    discount: updatedHistory.discount,
                    total: updatedHistory.total
                })
            })
        if (res.status === 200) {
            console.log('update successfully')
            const edited = await res.json()
            historys.value = historys.value.map((historyValue) => {
                if (historyValue.id === edited.id) {
                    historyValue.numList = edited.numList
                    historyValue.dateTime = edited.dateTime
                    historyValue.customer = edited.customer
                    historyValue.discount = edited.discount
                    historyValue.total = edited.total
                }
                return historyValue
            })
            setCurrentComponant('historyComponant')
            editHis.value = undefined
        }
        else {
            throw new Error('Oops, sorry cannot edit')
        }
    }
    catch (err) {
        console.log(err)
    }
}
</script>

<template>
    <cashierEdit v-if="currentComponant === 'CashierComponent'" :history="editHis" @edit="editHistory" />
    <div v-if="currentComponant === 'historyComponant'" class="h-5/6">
        <div class="w-full h-16 flex items-center text-2xl font-medium" style="color: #304477;">
            <div class="mx-40">
                History
            </div>
        </div>

        <div class="w-4/5 h-4/5 mx-auto rounded-3xl " style="background-color: #BEBEBE;">
            <div class="h-full overflow-auto">
                <div class="grid grid-cols-10 gap-2 text-black font-medium text-xl mt-5">
                    <div class="col-span-1 justify-self-center"></div>
                    <div class="col-span-2 justify-self-center">Date</div>
                    <div class="col-span-2 justify-self-center">Customers</div>
                    <div class="col-span-2 justify-self-center">Discount</div>
                    <div class="col-span-2 justify-self-center">Purchase</div>
                    <div class="col-span-1 justify-self-center"></div>
                </div>
                <div class="grid grid-cols-10 text-center py-3 rounded-lg" v-for="history in historys">
                    <button class="justify-self-center">
                        <trash class="col-span-1 " @click="deleteHistory(history.id)" />
                    </button>
                    <div class="col-span-2 justify-self-center text-black">{{ history.dateTime }}</div>
                    <div class="col-span-2 justify-self-center text-black">{{ history.customer }}</div>
                    <div class="col-span-2 justify-self-center text-red-600">{{ history.discount }} %</div>
                    <div class="col-span-2 justify-self-center text-black">{{ history.total }}</div>
                    <button class="justify-self-center">
                        <edit class="col-span-1" @click="setEditMode(history)" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>