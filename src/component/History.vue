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
            historys.value = historys.value.filter((histo) => {
                return histo.id !== deleteId
            })
        } else throw new error('Error, cannot delete data!')
    } catch (error) {
        console.log(error)
    }
}

const currentComponant = ref('histComp')
const setCurrentComponant = (curComp) => {
    currentComponant.value = curComp
}

const editHis = ref(undefined)
const setEditMode = (history) => {
    editHis.value = history
    setCurrentComponant('AddEditComp')
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
            historys.value = historys.value.map((historyList) => {
                if (historyList.id === edited.id) {
                    historyList.numList = edited.numList
                    historyList.dateTime = edited.dateTime
                    historyList.customer = edited.customer
                    historyList.discount = edited.discount
                    historyList.total = edited.total
                }
                return historyList
            })
            setCurrentComponant('histComp')
            editHis.value = undefined
        } 
        else {
            throw Error("Oops, sorry can't edit")
        }
    }
    catch (err) {
        console.log(err)
    }
}
</script>

<template>
    <cashierEdit v-if="currentComponant === 'AddEditComp'" :histoList="editHis" @edit="editHistory" />
    <div v-if="currentComponant === 'histComp'" class="h-5/6">
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