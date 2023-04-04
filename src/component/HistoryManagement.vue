<script setup>
import { ref, onMounted } from 'vue'
import addEdit from './AddEdit.vue'
import trash from './icon/Trash.vue'
import edit from './icon/Edit.vue'
import { getHistory } from '../composable/getHistory.js'

const history = ref([])

onMounted(async () => {
    history.value = await getHistory()
})

const currentComp = ref('historyComp')
const setCurrentComp = (current) => {
    currentComp.value = current
}

const editHistory = ref(undefined)
const setEditMode = (historys) => {
    editHistory.value = historys
    setCurrentComp('addEditComp')
}

const deleteHistory = async (deleteId) => {
    try {
        const res = await fetch(`http://localhost:5000/history/${deleteId}`, {
            method: 'DELETE'
        })
        if (res.ok) {
            history.value = history.value.filter((his) => {
                return his.id !== deleteId
            })
        } else throw new error('Error')
    } catch (err) {
        console.log(err)
    }
}

const editNewHistory = async (updatedEdit) => {
    console.log(updatedHistory)
    try {
        const res = await fetch(`http://localhost:5000/history/${updatedHistory.id}`,
            {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    date: updatedHistory.date,
                    customer: updatedHistory.customer,
                    discount: updatedHistory.discount,
                    total: updatedHistory.total,
                    addList: updatedHistory.addList
                })
            })
        if (res.status === 200) {
            console.log('update successfully')

            const edited = await res.json()
            history.value = history.value.map((hisList) => {
                if (hisList.id === edited.id) {
                    hisList.date = edited.date
                    hisList.customer = edited.customer
                    hisList.discount = edited.discount
                    hisList.total = edited.total
                    hisList.addList = edited.addList
                }
                return hisList
            })
            console.log(history)

            setCurrentComp('historyComp')
            editHistory.value = undefined
        } else {
            throw new Error('cannot edit')
        }
    }
    catch (err) {
        console.log(err)
    }
}


</script>
<template>
        <div class="w-full h-16 flex items-center text-2xl font-medium" style="color: #304477;">
            <div class="mx-40">
                History
            </div>
        </div>
</template>

<style scoped></style>