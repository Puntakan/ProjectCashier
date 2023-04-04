<script setup>
import { ref, onMounted, watch } from 'vue'
import trash from './icon/Trash.vue'

const emits = defineEmits(['edit'])

const props = defineProps({
    historys: {
        type: Object,
    }
})



const updated = ref({})

onMounted(() => {
    // Add mode 
    if (props.historys === undefined) {
        updated.value = {
            numList: [],
            dateTime: "",
            customer: "Guest",
            subTotal: 0,
            discount: 0,
            total: 0,
            numDis: 0

        }
    }
    // Edit mode
    else {
        updated.value = props.historys
    }
})

const getDis = (box) => {
    const subTalValue = updated.value.subTotal
    const customerValue = updated.value.customer
    switch (box) {
        case 1:
            return subTalValue >= 5000 && subTalValue < 10000 && customerValue === 'Member' ? 'bg-green-500 text-black' : 'bg-gray-300'
        case 2:
            return subTalValue >= 10000 && subTalValue < 20000 && customerValue === 'Member' ? 'bg-green-500 text-black' : 'bg-gray-300'
        case 3:
            return subTalValue >= 20000 && subTalValue < 30000 && customerValue === 'Member' ? 'bg-green-500 text-black' : 'bg-gray-300'
        case 4:
            return subTalValue >= 30000 && customerValue === 'Member' ? 'bg-green-500 text-black' : 'bg-gray-300'
        default:
            return 'bg-gray-300'
    }
}

const numberInput = ref('');
const numberList = ref([]);
const addNumber = () => {
    numberList.value.push(Number(numberInput.value));
    numberInput.value = '';
    updated.value.numList = numberList
};

const deleteItem = (index) => {
    updated.value.numList.splice(index, 1);
}

const subTotal = () => {
    let subtal = Number(numberList.value.reduce((acc, curr) => acc + curr, 0))
    updated.value.subTotal = subtal
    return subtal
}

const discount = () => {
    const customerValue = updated.value.customer
    let discountPercent = 0
    if (customerValue === 'Member') {
        if (subTotal() >= 5000 && subTotal() <= 7999) {
            discountPercent = 5
        } else if (subTotal() >= 8000 && subTotal() <= 14999) {
            discountPercent = 10
        } else if (subTotal() >= 15000 && subTotal() <= 29999) {
            discountPercent = 20
        } else if (subTotal() >= 30000) {
            discountPercent = 30
        }
    }
    updated.value.discount = discountPercent
    return discountPercent
}

const numDis = () => {
    const subTotalValue = subTotal()
    const discountPercent = discount()
    const discountAmount = subTotalValue * (discountPercent / 100)
    return discountAmount
}

const total = () => {
    let numTotal = Number(subTotal() - numDis())
    return numTotal
}

const customerType = (cus) => {
    if (cus === 'Guest') {
        updated.value.customer = 'Guest'
    }
    if (cus === "Member") {
        updated.value.customer = "Member"
    }
    console.log(updated.value.customer)
}

const minus = (discount) => {
    if (discount == 0) {
        return discount
    }
    else {

        return '-' + discount
    }
}

const comma = (num) => {
    return num.toLocaleString("en")
}

const addNewHistory = async (newHis) => {
    console.log(updated.value.numList)
    updated.value.numList = numberList
    updated.value.dateTime = new Date().toLocaleString()
    updated.value.discount = Number(discount())
    updated.value.total = Number(total())

    if (updated.value.total !== 0) {
        try {
            const res = await fetch('http://localhost:5000/history', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    numList: newHis.numList,
                    dateTime: newHis.dateTime,
                    customer: newHis.customer,
                    discount: newHis.discount,
                    total: newHis.total
                })
            })
            if (res.status === 201) {
                console.log('add successfully')
                console.log(updated)
            }
            else {
                throw new Error('cannot add')
            }
        } catch (err) {
            console.log(err)
        }
    }

}

</script>
 
<template>
    <!-- Cashier -->
    <div class="w-full h-16 flex items-center text-2xl font-medium" style="color: #304477;">
        <div class="mx-40">
            Cashier
        </div>
    </div>

    <!-- input & show -->
    <div class="w-4/5 h-4/5 mx-auto rounded-3xl " style="background-color: #BEBEBE;">
        <div class="flex flex-col">
            <div class="flex flex-row mt-7 justify-center">
                <input v-model="numberInput" type="number" class="w-10/12 h-10 rounded-lg mr-5 text-black"
                    style="background-color: #FFFFFF;" min="0" @input="numberInput = Math.max($event.target.value, 0)">
                <button @click='addNumber()' class="w-20 h-10 rounded-lg flex items-center justify-center"
                    style="background-color: #4263EB; color: #FFFFFF">Add</button>
            </div>

            <div class="w-11/12 h-48 mx-auto mt-6 bg-white  rounded-lg text-black overflow-auto">
                <div class="ml-10" v-if="(updated.numList || []).length > 0"> No </div>
                <div class="ml-10 mr-10 flex flex-col" v-for="(number, index) in updated.numList" :key="index">
                    <div class="flex flex-row items-center mb-1">
                        <div>
                            {{ comma(index + 1) }}. {{ comma(number) }} ฿
                        </div>
                        <button class="flex items-center ml-auto" @click="deleteItem(index)">
                            <trash /> &nbsp; &nbsp;
                        </button>
                    </div>
                    <hr class="w-12/12">
                </div>
            </div>
        </div>

        <div class="flex flex-row mt-3 ml-14">
            <div class="text-black">Customer:</div>
            <button class="w-6 h-6 rounded-full border-2 border-white bg-white ml-4 focus:outline-none"
                :class="{ 'bg-blue-500': updated.customer === 'Guest' }" @click="customerType('Guest')"></button>
            <div class="text-black ml-1">Guest</div>

            <button class="w-6 h-6 rounded-full border-2 border-white bg-white ml-4 focus:outline-none"
                :class="{ 'bg-blue-500': updated.customer === 'Member' }" @click="customerType('Member')"></button>
            <div class="text-black ml-1">Member</div>
        </div>

        <div class="flex flex-col">
            <div class="text-black ml-14 mt-3"> Discount ({{ updated.customer }}) :</div>
            <div class="flex flex-row mt-3 ml-14">
                <div class="w-20 h-11 flex justify-center items-center rounded-lg text-lg mr-2" :class="getDis(1)">5%</div>
                <div class="w-20 h-11 flex justify-center items-center rounded-lg text-lg mr-2" :class="getDis(2)">10%</div>
                <div class="w-20 h-11 flex justify-center items-center rounded-lg text-lg mr-2" :class="getDis(3)">20%</div>
                <div class="w-20 h-11 flex justify-center items-center rounded-lg text-lg " :class="getDis(4)">30%</div>
            </div>
        </div>

        <div>
            <div class="flex flex-row justify-end mr-14 mt-5 font-medium text-gray-500">
                <div class="w-auto flex justify-end items-center ">Sub Total : {{ subTotal() }} ฿</div>
            </div>

            <div class="flex flex-row justify-end mr-14 font-medium text-red-600">
                <div class="w-auto  flex justify-center items-center ">Discount : {{ numDis() }} ฿ </div>
            </div>

            <div class="flex flex-row justify-end mr-14 font-bold text-xl text-green-700">
                <div class="w-auto flex justify-center items-center ">Total : {{ total() }} ฿</div>
            </div>
        </div>

        <div class="flex justify-end my-3">
            <button class="w-26 rounded-md p-3 text-white bg-red-600" v-if="updated.id" @click="$emit('edit', updated)">
                Edit
            </button>

            <button class="w-20 h-10 flex justify-center items-center bg-blue-700 rounded-lg font-sans text-sm text-white mb-2 mr-14 " @click="addNewHistory(updated)" v-else>
                Confirm
            </button>
        </div>
    </div>
</template>
 
<style scoped></style>