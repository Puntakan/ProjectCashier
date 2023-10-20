<script setup>
import { ref, onMounted } from 'vue'
import trash from './icon/Trash.vue'
import editIcon from './icon/Edit.vue';

const emits = defineEmits(['edit'])

const props = defineProps({
    history: {
        type: Object,
    }
})

const updated = ref({})

onMounted(() => {
    // Add mode 
    if (props.history === undefined) {
        updated.value = {
            numList: [],
            dateTime: "",
            customer: "Guest",
            subTotal: 0,
            discount: 0,
            total: 0,
        }
    }
    // Edit mode
    else {
        updated.value = props.history
    }
})

const getPercentBox = (box) => {
    const subTotalValue = updated.value.subTotal
    const customerValue = updated.value.customer
    switch (box) {
        case 1:
            return subTotalValue >= 5000 && subTotalValue < 10000 && customerValue === 'Member' ? 'bg-green-500 text-black' : 'bg-gray-300'
        case 2:
            return subTotalValue >= 10000 && subTotalValue < 20000 && customerValue === 'Member' ? 'bg-green-500 text-black' : 'bg-gray-300'
        case 3:
            return subTotalValue >= 20000 && subTotalValue < 30000 && customerValue === 'Member' ? 'bg-green-500 text-black' : 'bg-gray-300'
        case 4:
            return subTotalValue >= 30000 && customerValue === 'Member' ? 'bg-green-500 text-black' : 'bg-gray-300'
        default:
            return 'bg-gray-300'
    }
}

const numberInput = ref('');
const addNumList = () => {
    updated.value.numList.push(Number(numberInput.value));
    numberInput.value = '';

};

const deleteItemList = (index) => {
    updated.value.numList.splice(index, 1);
}

const subTotal = () => {
    let calSubTotal = Number(updated.value.numList?.reduce((acc, curr) => acc + curr, 0))
    updated.value.subTotal = calSubTotal
    return updated.value.subTotal
}

const discount = () => {
    const customerValue = updated.value.customer
    let discountPercent = 0
    if (customerValue === 'Member') {
        if (subTotal() >= 5000 && subTotal() < 10000) {
            discountPercent = 5
        } else if (subTotal() >= 10000 && subTotal() < 20000) {
            discountPercent = 10
        } else if (subTotal() >= 20000 && subTotal() < 30000) {
            discountPercent = 20
        } else if (subTotal() >= 30000) {
            discountPercent = 30
        }
    }
    updated.value.discount = discountPercent
    return discountPercent
}

const calDiscount = () => {
    const discountAmount = subTotal() * (discount() / 100)
    return discountAmount
}

const total = () => {
    let calTotal = Number(subTotal() - calDiscount())
    updated.value.total = calTotal
    return updated.value.total
}

const customerType = (type) => {
    if (type === 'Guest') {
        updated.value.customer = 'Guest'
    }
    if (type === "Member") {
        updated.value.customer = "Member"
    }
    // console.log(updated.value.customer)
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

const addHistory = async (addHis) => {
    // console.log(updated.value.numList)
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
                    numList: addHis.numList,
                    dateTime: addHis.dateTime,
                    customer: addHis.customer,
                    discount: addHis.discount,
                    total: addHis.total
                })
            })
            if (res.status === 201) {
                // console.log('add successfully')
                updated.value = {
                    numList: [],
                    dateTime: "",
                    customer: "Guest",
                    subTotal: 0,
                    discount: 0,
                    total: 0,
                }
            }
            else {
                throw new Error('Oops, sorry cannot add')
            }
        } catch (err) {
            console.log(err)
        }
    }
}

const editingIndex = ref(-1);

const editItem = (index) => {
    const newValue = prompt("Enter the new value"); // แสดง Prompt ให้ผู้ใช้ป้อนค่าใหม่

    // ตรวจสอบว่าผู้ใช้ป้อนค่าใหม่หรือไม่ และตรวจสอบว่าค่าใหม่เป็นตัวเลขหรือไม่
    if (newValue !== null && !isNaN(newValue)) {
        updated.value.numList[index] = parseFloat(newValue); // แปลงค่าใหม่เป็นตัวเลขและแก้ไขค่าใน updated.value.numList
    }
};

const startEdit = (index) => {
    editingIndex.value = index; // ตั้งค่า editingIndex เป็นดัชนีของรายการที่จะแก้ไข
}

const finishEdit = () => {
    editingIndex.value = -1; // ตั้งค่า editingIndex เป็น -1 เพื่อไม่แสดงช่องป้อนข้อมูล
};

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
                <button @click='addNumList()' class="w-20 h-10 rounded-lg flex items-center justify-center"
                    style="background-color: #4263EB; color: #FFFFFF">Add</button>
            </div>

            <div class="w-11/12 h-48 mx-auto mt-6 bg-white rounded-lg text-black overflow-auto">
                <div class="ml-10" v-if="(updated.numList || []).length > 0"> No </div>
                <div class="ml-10 mr-10">
                    <div class="flex flex-row items-center mb-1" v-for="(number, index) in updated.numList" :key="index">
        
                        <div v-if="editingIndex === index" class="flex items-center w-full">
                            <input v-model="updated.numList[editingIndex]" type="number"
                                class="w-full h-6 rounded-lg mr-5 text-black" style="background-color: #e0e0e0;" min="0"
                                @input="updated.numList[editingIndex] = Math.max($event.target.value, 0)">
                            <button @click="finishEdit()"
                                class="w-10 h-6 rounded-lg flex items-center justify-center ml-auto"
                                style="background-color: #4263EB; color: #FFFFFF; float: right;">Save</button>
                        </div>
                        <div v-else class="flex items-center">
                            {{ comma(index + 1) }}. {{ comma(number) }} ฿
                        </div>
                        <hr class="w-12/12">
                        <button v-if="editingIndex !== index" @click="startEdit(index)"
                            class="flex items-center justify-end ml-auto">
                            <editIcon /> &nbsp; &nbsp;
                        </button>
                        <button v-if="editingIndex !== index" class="flex items-center" @click="deleteItemList(index)">
                            <trash /> &nbsp; &nbsp;
                        </button>
                        <button v-if="editingIndex === index && editingIndex !== index" @click="finishEdit()"
                            class="w-10 h-6 rounded-lg flex items-center justify-center"
                            style="background-color: #4263EB; color: #FFFFFF">Edit</button>
                    </div>
                    
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
                <div class="w-20 h-11 flex justify-center items-center rounded-lg text-lg mr-2" :class="getPercentBox(1)">5%
                </div>
                <div class="w-20 h-11 flex justify-center items-center rounded-lg text-lg mr-2" :class="getPercentBox(2)">
                    10%</div>
                <div class="w-20 h-11 flex justify-center items-center rounded-lg text-lg mr-2" :class="getPercentBox(3)">
                    20%</div>
                <div class="w-20 h-11 flex justify-center items-center rounded-lg text-lg " :class="getPercentBox(4)">30%
                </div>
            </div>
        </div>

        <div>
            <div class="flex flex-row justify-end mr-14 mt-5 font-medium text-gray-500">
                <div class="w-auto flex justify-end items-center ">Sub Total : {{ comma(subTotal()) }} ฿</div>
            </div>

            <div class="flex flex-row justify-end mr-14 font-medium text-red-600">
                <div class="w-auto  flex justify-center items-center ">Discount : {{ minus(comma(calDiscount())) }} ฿ </div>
            </div>

            <div class="flex flex-row justify-end mr-14 font-bold text-xl text-green-700">
                <div class="w-auto flex justify-center items-center ">Total : {{ comma(total()) }} ฿</div>
            </div>
        </div>

        <div class="flex justify-end my-3">
            <button
                class="w-20 h-10 flex justify-center items-center bg-red-600 rounded-lg font-sans text-sm text-white mb-2 mr-14"
                v-if="updated.id" @click="$emit('edit', updated)">
                Confirm
            </button>

            <button
                class="w-20 h-10 flex justify-center items-center bg-blue-700 rounded-lg font-sans text-sm text-white mb-2 mr-14 "
                @click="addHistory(updated)" v-else>
                Confirm
            </button>
        </div>
    </div>
</template>
 
<style scoped>
</style>